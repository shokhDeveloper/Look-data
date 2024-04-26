import { foods } from "../../database/foods.js"


export default {
    Query: {
        foods: (_, {foodId}) => {
            if(foodId){
               return [foods.find((food) => food.food_id == foodId)] 
            }
            return foods
        } },
    Food: {
        foodId: (parent) => parent.food_id,
        foodName: (parent) => parent.food_name,
        foodImg: (parent) => parent.food_img
    },
    Mutation: {
        addFood: (_, args) => {
            try{
                const food = {
                    food_name: args.foodName,
                    food_img: args.foodImg,
                    food_id: foods.length + 1
                }
                foods.push(food);
                return {
                    status: 201,
                    message: "The food successfully created !",
                    data: food
                }
            }catch(error){
                return {
                    status: error.status || 500,
                    message: error.message
                }
            }
        },
        changeFood: (_, args) => {
            try{
                if(args.foodId){
                    const idx = foods.findIndex((food) => food.food_id == args.foodId);
                    if(idx >= 0) {  
                        foods[idx] = {
                            food_id: args.foodId,
                            food_img: args.foodImg ? args.foodImg: foods[idx].food_img ,
                            food_name: args.foodName ? args.foodName: foods[idx].food_name
                        }
                        return {
                            status: 200,
                            message: "The food successfully updated !",
                            data: foods[idx]
                        }
                    }else throw new Error("Food not found")
                }
            }catch(error){
                return {
                    status: error.status || 500,
                    message: error.message
                }
            }
        },
        deleteFood: (_, args) => {
            try{
                const idx = foods.findIndex((food) => food.food_id == args.foodId);
                if(idx >= 0){
                    let delFood = foods.splice(idx, 1);
                    return {
                        status: 200,
                        message: "The food deleted successfully",
                        data: delFood
                    }
                }else throw new Error("Food not found")
            }catch(error){
                return {
                    status: error.status || 500,
                    message: error.message,
                }
            }
        }
    }
    
}