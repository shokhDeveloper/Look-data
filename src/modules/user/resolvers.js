import { users } from "../../database/users.js";
const handleToCheckKeys = (defUser, updateData) => {
    try{
        const defKeys = Object.keys(defUser);
        const updateKeys = Object.keys(updateData);
        let count = 0;
        for(let i = 0; i<updateKeys.length; i++){
            if(updateKeys[i] == "userId") count ++
            if(defKeys.includes(updateKeys[i])) count ++;
        };
        console.log(count, updateKeys.length)
        if(updateKeys.length == count) return true
        else return false
    }catch(error){
        console.log(error)
    }
}
export default {
    Query: {
        users: (_, {userId, pagination, search}) => {
            let myUsers = users;
            if(search){
                myUsers = users.filter((user) => user.username.toLowerCase().includes(search.toLowerCase()));
            }
            if(userId) {
                myUsers = [users.find((user) => user.user_id == userId)];
            }
            myUsers = myUsers.slice(pagination.page * pagination.limit - pagination.limit, pagination.limit * pagination.page)
            return myUsers
        }
    },
    User: {
        userId: (parent) => parent.user_id,
        username: (parent) => parent.username,
        contact: (parent) => parent.contact
    },
    Mutation: {
        addUser: (_, {username, contact}) => {
            try{
                const newUser = {
                    userId: users.length + 1,
                    username,
                    contact
                }
                users.push(newUser);
                return  {
                    status: 201,
                    message: "The user successfully added",
                    data: newUser
                }
            }catch(error){
                return {
                    status: error.status || 500,
                    message: error.message
                }              
            }
        },
        delUser: (_, {userId}) => {
            try{
                const idx = users.findIndex((user) => user.user_id == userId);
                if(idx >= 0){
                    let delUser = users.splice(idx, 1);
                    return {
                        status: 200,
                        message: "User successfully deleted !",
                        data: delUser
                    };
                } else throw new Error("User not found");
            }catch(error){
                return {
                    status: error.status || 400,
                    message: error.message
                }
            }
        },
        changeUser: (_, args) => {
            try{
                if(args.userId){
                    const idx = users.findIndex((user) => user.user_id == args.userId);
                    if(idx >=0 ){
                        if(handleToCheckKeys(users[idx], args)){
                            users[idx] = {...users[idx], ...args}
                            delete users[idx].userId
                            return {
                                status: 200,
                                message: "User successfully updated",
                                data: users[idx]
                            }
                        }else throw new Error(`${Object.keys(args).join(", ")} Invalid keys`);
                    }else throw new Error("User not found");
                }else throw new Error("User id is required !");
            }catch(error){
                return {
                    status: error.status || 500,
                    message: error.message
                }
            }
        }
    }
}