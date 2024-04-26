import { ApolloServer } from "apollo-server";
import modules from "./modules/index.js";
let moduleArray = Object.values(modules)
const mergedServer = new ApolloServer({ modules: moduleArray });

mergedServer.listen(4000).then(({ url }) => {
  console.log(`Server is running at ${url}`);
});