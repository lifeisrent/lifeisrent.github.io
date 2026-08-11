const GITHUB_API_ROOT =
    "https://api.github.com";

export async function onRequestPost(context) {
    try {
        const requestBody =
            await context.request.json();

        const normalizedInput =
            normalizeInput(requestBody);

        const repoOwner =
            requireEnv(context, "GITHUB_REPO_OWNER");

        const repoName =
            requireEnv(context, "GITHUB_REPO_NAME");

        const githubToken =
            requireEnv(context, "GITHUB_TOKEN");

        const commitName =
            requireEnv(context, "GITHUB_COMMIT_NAME");

        const commitEmail =
            requireEnv(context, "GITHUB_COMMIT_EMAIL");

        const slugBase =
            slugify(normalizedInput.title) || "post";

        const markdownContent =
            buildMarkdown(normalizedInput);

        const createdPost =
            await createPostFile({
                repoOwner,
                repoName,
                githubToken,
                commitName,
                commitEmail,
                topCategory: normalizedInput.topCategory,
                subCategory: normalizedInput.subCategory,
                postDate: normalizedInput.postDate,
                slugBase,
                markdownContent,
                title: normalizedInput.title
            });

        return Response.json({
            message: "Post created.",
            path: createdPost.path,
            commitUrl: createdPost.commitUrl
        });
    }
    catch (error) {
        return Response.json(
            {
                message: error.message || "Failed to create post."
            },
            {
                status: error.status || 500
            }
        );
    }
}

function normalizeInput(requestBody) {
    const title =
        String(requestBody.title || "").trim();

    const topCategory =
        String(requestBody.topCategory || "").trim();

    const subCategory =
        String(requestBody.subCategory || "").trim();

    const excerpt =
        String(requestBody.excerpt || "").trim();

    const thumbnail =
        String(requestBody.thumbnail || "").trim();

    const body =
        normalizeLineEndings(
            String(requestBody.body || "").trim()
        );

    const postDate =
        String(requestBody.date || "").trim();

    const tags =
        normalizeTags(requestBody.tags);

    if (!title) {
        throw badRequest("Title required.");
    }

    if (!topCategory) {
        throw badRequest("Top category required.");
    }

    if (!excerpt) {
        throw badRequest("Excerpt required.");
    }

    if (!body) {
        throw badRequest("Body required.");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
        throw badRequest("Date must be YYYY-MM-DD.");
    }

    validatePathSegment(topCategory, "Top category");

    if (subCategory) {
        validatePathSegment(subCategory, "Subcategory");
    }

    return {
        title,
        topCategory,
        subCategory,
        excerpt,
        thumbnail,
        body,
        postDate,
        tags
    };
}

async function createPostFile(input) {
    for (let suffix = 0; suffix < 20; suffix += 1) {
        const slug =
            suffix === 0 ?
                input.slugBase :
                input.slugBase + "-" + String(suffix + 1);

        const path =
            buildPostPath(
                input.topCategory,
                input.subCategory,
                input.postDate,
                slug
            );

        const existingFile =
            await githubRequest({
                method: "GET",
                path,
                repoOwner: input.repoOwner,
                repoName: input.repoName,
                githubToken: input.githubToken,
                allow404: true
            });

        if (existingFile.status === 404) {
            const createResult =
                await githubRequest({
                    method: "PUT",
                    path,
                    repoOwner: input.repoOwner,
                    repoName: input.repoName,
                    githubToken: input.githubToken,
                    body: {
                        message: "Create post: " + input.title,
                        content: encodeBase64Utf8(
                            input.markdownContent
                        ),
                        committer: {
                            name: input.commitName,
                            email: input.commitEmail
                        }
                    }
                });

            return {
                path,
                commitUrl:
                    createResult.body.commit &&
                    createResult.body.commit.html_url
            };
        }
    }

    throw serverError(
        "Could not find available filename."
    );
}

function buildMarkdown(input) {
    const categories =
        [
            input.topCategory,
            input.subCategory
        ].filter(Boolean);

    const frontMatterLines = [
        "---",
        'title: "' + escapeDoubleQuotes(input.title) + '"',
        'excerpt: "' + escapeDoubleQuotes(input.excerpt) + '"',
        "layout: post",
        "date: " + input.postDate + " 00:00:00 +0900",
        "categories:"
    ];

    categories.forEach(function (category) {
        frontMatterLines.push(
            "  - " + category
        );
    });

    if (input.thumbnail) {
        frontMatterLines.push(
            'thumbnail: "' +
            escapeDoubleQuotes(input.thumbnail) +
            '"'
        );
    }

    if (input.tags.length > 0) {
        frontMatterLines.push("tags:");

        input.tags.forEach(function (tag) {
            frontMatterLines.push(
                "  - " + tag
            );
        });
    }

    frontMatterLines.push("---", "", input.body, "");

    return frontMatterLines.join("\n");
}

function buildPostPath(topCategory, subCategory, postDate, slug) {
    const pathParts = [
        "_posts",
        topCategory
    ];

    if (subCategory) {
        pathParts.push(subCategory);
    }

    pathParts.push(postDate + "-" + slug + ".md");

    return pathParts.join("/");
}

async function githubRequest(input) {
    const response =
        await fetch(
            GITHUB_API_ROOT +
            "/repos/" +
            encodeURIComponent(input.repoOwner) +
            "/" +
            encodeURIComponent(input.repoName) +
            "/contents/" +
            input.path
                .split("/")
                .map(encodeURIComponent)
                .join("/"),
            {
                method: input.method,
                headers: buildGithubHeaders(
                    input.githubToken
                ),
                body: input.body ?
                    JSON.stringify(input.body) :
                    undefined
            }
        );

    if (input.allow404 && response.status === 404) {
        return {
            status: 404,
            body: null
        };
    }

    const responseText =
        await response.text();

    const responseBody =
        responseText ?
            safeJsonParse(responseText) :
            null;

    if (!response.ok) {
        throw {
            status: response.status,
            message:
                extractGithubError(responseBody) ||
                "GitHub API request failed."
        };
    }

    return {
        status: response.status,
        body: responseBody
    };
}

function buildGithubHeaders(githubToken) {
    return {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + githubToken,
        "Content-Type": "application/json",
        "User-Agent": "lifeisrent-post-writer"
    };
}

function requireEnv(context, envName) {
    const envValue =
        context.env[envName];

    if (!envValue) {
        throw serverError(
            envName + " not configured."
        );
    }

    return envValue;
}

function validatePathSegment(value, label) {
    if (
        value.includes("/") ||
        value.includes("\\") ||
        value.includes("..")
    ) {
        throw badRequest(
            label + " invalid."
        );
    }
}

function normalizeTags(tagsInput) {
    if (Array.isArray(tagsInput)) {
        return tagsInput
            .map(function (tag) {
                return String(tag || "").trim();
            })
            .filter(Boolean);
    }

    return String(tagsInput || "")
        .split(",")
        .map(function (tag) {
            return tag.trim();
        })
        .filter(Boolean);
}

function normalizeLineEndings(value) {
    return value.replace(/\r\n?/g, "\n");
}

function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function escapeDoubleQuotes(value) {
    return String(value).replace(/"/g, '\\"');
}

function encodeBase64Utf8(value) {
    const bytes =
        new TextEncoder().encode(value);

    let binaryString = "";

    bytes.forEach(function (byte) {
        binaryString += String.fromCharCode(byte);
    });

    return btoa(binaryString);
}

function safeJsonParse(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}

function extractGithubError(responseBody) {
    if (!responseBody) {
        return null;
    }

    if (responseBody.message) {
        return responseBody.message;
    }

    return null;
}

function badRequest(message) {
    return {
        status: 400,
        message
    };
}

function serverError(message) {
    return {
        status: 500,
        message
    };
}
