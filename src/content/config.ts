import { defineCollection, type CollectionConfig } from "astro:content";
import { fileLoader } from "../fileLoader";

const collections:any = {
	"files": defineCollection({
		loader: fileLoader({filepath: '/Users/jmreupsch/Documents/MD Vaults/Eminence of the Millenium/', pattern: '**.md'}),
	})
};

export function addCollection(name:string, collection: CollectionConfig<any>) {
	  collections[name] = collection;
}



export { collections };