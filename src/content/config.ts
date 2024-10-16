import { defineCollection, type CollectionConfig } from "astro:content";
import { fileLoader } from "../fileLoader";

const collections:any = {
};

export function addCollection(name:string, collection: CollectionConfig<any>) {
	  collections[name] = collection;
}



export { collections };