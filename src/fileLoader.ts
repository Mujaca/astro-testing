import type { DataStore, Loader, LoaderContext } from 'astro/loaders';
import fs from 'fs';
import { createHash } from 'crypto';

// Define any options that the loader needs
export function fileLoader(options: { filepath: string, pattern: string }): Loader {
	return {
		name: "file-loader",
		load: async (context: LoaderContext): Promise<void> => {
			try {
				const files = fs.readdirSync(options.filepath, { recursive: true, withFileTypes: true });
				if (context.refreshContextData) context.store.clear();
				for (const file of files) {
					if (checkFilePathAgainstPattern(file.name, options.pattern)) {
						const filePath = options.filepath + file.name;
						const content = fs.readFileSync(filePath, 'utf-8');
						const digest = context.generateDigest(content);

						context.store.set({
							id: file,
							filePath: filePath,
							data: content,
							digest
						});
					}
				}

				console.log("Loaded " + files.length + " files from " + options.filepath);
			} catch (error) {
				console.error("Error reading files from " + options.filepath);
				console.error(error);
			}
		}
	}
}

function checkFilePathAgainstPattern(filePath: string, pattern: string): boolean {
	// * is a wildcard
	// ** is a recursive wildcard
	const patternParts = pattern.split('/');
	const filePathParts = filePath.split('/');

	if (patternParts.length !== filePathParts.length) {
		return false;
	}

	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i] === '**') {
			// Recursive wildcard
			continue;
		} else if (patternParts[i] === '*') {
			// Wildcard
			continue;
		} else if (patternParts[i] !== filePathParts[i]) {
			return false;
		}
	}

	return true;

}