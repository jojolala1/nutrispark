"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { IFoodReduced, IFood } from "@/types";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [foods, setFoods] = useState<IFoodReduced[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchFoods = async () => {
        try {
            const response = await fetch("/api/foods/all");
            const data = await response.json();
            const foodReduced: IFoodReduced[] = data.map((food: IFood) => {
                return {
                    value: food?.name.toLocaleLowerCase().replace(/ /g, "-"),
                    label: food?.name,
                };
            });
            setFoods(foodReduced);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const initialize = async () => {
            await fetchFoods();
            setIsLoading(false);
        };
        initialize();
    }, []);

    useEffect(() => {
        if (value.length > 0) {
            router.push(`/food/${value}`);
        }
    }, [value]);

    return (
        <>
            {!isLoading ? (
                <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
                    <h1 className="text-5xl font-extrabold mb-4">
                        {" "}
                        welcome to{" "}
                        <span className="title_colored">Nutrispark</span>
                    </h1>
                    <p className="text-lg mb-8 text-center max-w-2xl">Discover the nutritionnal values of your favorite foods. Use the search below to get started</p>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[300px] justify-between"
                            >
                                {value
                                    ? foods.find((food) => food.value === value)
                                          ?.label
                                    : "Select food..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Search food..." />
                                <CommandList>
                                    <CommandEmpty>No food found.</CommandEmpty>
                                    <CommandGroup>
                                        {foods.map((food) => (
                                            <CommandItem
                                                key={food.value}
                                                value={food.value}
                                                onSelect={(currentValue) => {
                                                    setValue(
                                                        currentValue === value
                                                            ? ""
                                                            : currentValue
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === food.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {food.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen text-white">
                    <h1>Chargement...</h1>
                </div>
            )}
        </>
    );
}
