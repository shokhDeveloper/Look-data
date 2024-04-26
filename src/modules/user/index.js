import { gql } from "apollo-server";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync( path.join(__dirname, "schema.gql"), "UTF-8" );

const typeDefs = gql`${file}`;
import resolvers from "./resolvers.js";

export default {
    typeDefs, resolvers
}