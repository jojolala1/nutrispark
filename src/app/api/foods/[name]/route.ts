import { foods } from "@/data";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ name: string }> }
) {
    const { name } = await params;
    const index = foods.findIndex(
        (food) => food.name.toLowerCase().replace(/ /g, "-") === name
    );
    if (index !== -1) {
        return new Response(JSON.stringify(foods[index]),{
            headers:{
                "Content-type": "application/json",
            },status: 200,
        });
    } else {
        return new Response("food not found", {
            headers: {
                "Content-type": "application/json",
            },
            status: 404,
        });
    }
}
