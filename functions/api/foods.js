export async function onRequestGet(context) {
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