"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IFood, IMacronutrientData } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
type FoodParams = {
    name?: string;
};
export default function FoodPage() {
    const router = useRouter();
    const params = useParams() as FoodParams;

    const [food, setFood] = useState<IFood | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [Macronutriments, setMacronutriments] = useState<
        IMacronutrientData[]
    >([]);

    const COLORS = ["#F28907", "#5079F2", "#F2220F"];

    const fetchFood = async () => {
        try {
            const APIQueryURL = `/api/foods/${params.name}`;
            const response = await fetch(APIQueryURL);
            const data = await response.json();

            //Macronutriments
            const MacronutrimentsDatas: IMacronutrientData[] = [
                { name: "carbohydrates", value: data.carbohydrates },
                { name: "protein", value: data.protein },
                { name: "fat", value: data.fat },
            ];

            setMacronutriments(MacronutrimentsDatas);

            //Food general
            setFood(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchFood();
        };
        initialize();
    }, []);

    if (!isLoading && food && Macronutriments) {
        return (
            <>
                <div className="p-8 text-white">
                    <Undo2
                        className="cursor-pointer mb-5 text-white"
                        onClick={() => router.back()}
                    />
                    <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                        {food.name}
                    </h1>
                    <div className="flex flex-col md:flex-row items-center md:items-start">
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-8 md:mb-0">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={Macronutriments}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {Macronutriments.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="text-center mt-">
                                <span className="inline-block w-3 h-3 bg-[#F28907]"></span>{" "}
                                Carbohydrates
                                <span className="inline-block w-3 h-3 bg-[#5079F2] ml-4"></span>{" "}
                                Protein
                                <span className="inline-block w-3 h-3 bg-[#F2220F] ml-4"></span>{" "}
                                Fat
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-2/3 ">
                            <p className="text-lg font-semibold mb-4">
                                Nutritionnal Information per 100g
                            </p>
                            <div className="mb-4 p-4 text-white bg-gray-800 rounded-lg shadow-inner">
                                <div className="mb-2">
                                Calories:{" "}
                                        <span className="font-medium">
                                            {food.calories} cal
                                        </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="w-5 h-5 bg-[#F28907] inline-block mr-3"></span>
                                    <p>
                                        Carbohydrates:{" "}
                                        <span className="font-medium">
                                            {food.carbohydrates}g
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="w-5 h-5 bg-[#5079F2] inline-block mr-3"></span>
                                    <p>
                                    protein:{" "}
                                        <span className="font-medium">
                                            {food.protein}g
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="w-5 h-5 bg-[#F2220F] inline-block mr-3"></span>
                                    <p>
                                        Fat:{" "}
                                        <span className="font-medium">
                                            {food.fat}g
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center mb-2">
                                        <Image src="/vitamins.png" width={30} height={30} alt="vitamins"/>
                                        <div className="ml-3">
                                            <span className="font-semibold">Vitamins: </span>
                                            {food.vitamins?.join(", ")}
                                        </div>
                                </div>
                                <div className="flex items-center mb-2">
                                        <Image src="/minerals.png" width={30} height={30} alt="vitamins"/>
                                        <div className="ml-3">
                                            <span className="font-semibold">minerals: </span>
                                            {food.minerals?.join(", ")}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <h1>Chargement...</h1>
            </div>
        );
    }
}
