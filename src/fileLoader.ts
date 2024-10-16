import type { DataStore, Loader, LoaderContext } from 'astro/loaders';
import * as filePathFilter from '@jsdevtools/file-path-filter';
import * as fs from 'fs';
import path from 'path';

// Define any options that the loader needs
export function fileLoader(options: { filepath: string, pattern: string }): Loader {
	return {
		name: "file-loader",
		load: async (context: LoaderContext): Promise<void> => {
			try {
				const files = fs.readdirSync(options.filepath, { recursive: true, withFileTypes: true }).map(file => {
					const cleanedPath = file.path.replace(options.filepath, '');
					return cleanedPath + "/" + file.name
				}).filter(filePathFilter.filePathFilter(options.pattern));
				if (context.refreshContextData) context.store.clear();
				for (const file of files) {
					const relativeFilePath = path.relative("./", options.filepath) + "/" + file;
					const content = fs.readFileSync(relativeFilePath, 'utf-8');

					const data = await context.parseData({
						id: file,
						data: {
							content
						},
						filePath: relativeFilePath,
					})

					const digest = context.generateDigest(data);

					context.store.set({
						id: file,
						filePath: relativeFilePath,
						data,
						digest
					});
				}

				console.log("Loaded " + files.length + " files from " + options.filepath);
			} catch (error) {
				console.error("Error reading files from " + options.filepath);
				console.error(error);
			}
		}
	}
}