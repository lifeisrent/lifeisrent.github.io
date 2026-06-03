export async function onRequestGet(context) {
    await ensureDeletedAtColumn(context);

    const foodsResult = await context.env.DB
        .prepare(
            `
            SELECT
                id,
                name,
                expiration_date,
                created_at,
                CASE
                    WHEN expiration_date < date('now', '+9 hours')
                    THEN 1
                    ELSE 0
                END AS expired
            FROM foods
            WHERE deleted_at IS NULL
            ORDER BY expiration_date ASC, id DESC
            `
        )
        .all();

    return Response.json({
        foods: foodsResult.results
    });
}

export async function onRequestPost(context) {
    const requestBody = await context.request.json();

    const foodName = String(requestBody.name || "").trim();
    const expirationDate = String(requestBody.expirationDate || "").trim();

    if (!foodName || !expirationDate) {
        return Response.json(
            {
                message: "식품 이름과 유통기한을 입력해주세요."
            },
            {
                status: 400
            }
        );
    }

    await context.env.DB
        .prepare(
            `
            INSERT INTO foods (
                name,
                expiration_date
            )
            VALUES (
                ?,
                ?
            )
            `
        )
        .bind(
            foodName,
            expirationDate
        )
        .run();

    return Response.json({
        message: "저장되었습니다."
    });
}

export async function onRequestDelete(context) {
    await ensureDeletedAtColumn(context);

    const requestBody = await context.request.json();
    const foodId = Number(requestBody.id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
        return Response.json(
            {
                message: "삭제할 식품 ID가 올바르지 않습니다."
            },
            {
                status: 400
            }
        );
    }

    const deleteResult = await context.env.DB
        .prepare(
            `
            UPDATE foods
            SET deleted_at = datetime('now', '+9 hours')
            WHERE id = ?
                AND deleted_at IS NULL
            `
        )
        .bind(foodId)
        .run();

    if (!deleteResult.success) {
        return Response.json(
            {
                message: "삭제에 실패했습니다."
            },
            {
                status: 500
            }
        );
    }

    return Response.json({
        message: "삭제되었습니다."
    });
}

async function ensureDeletedAtColumn(context) {
    const columnsResult = await context.env.DB
        .prepare("PRAGMA table_info(foods)")
        .all();

    const hasDeletedAtColumn = columnsResult.results.some(
        function (column) {
            return column.name === "deleted_at";
        }
    );

    if (hasDeletedAtColumn) {
        return;
    }

    await context.env.DB
        .prepare(
            `
            ALTER TABLE foods
            ADD COLUMN deleted_at TEXT
            `
        )
        .run();
}
