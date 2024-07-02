import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export const generateThumbnail = async (videoUrl: string): Promise<string> => {
    const outputFileName = `/tmp/${uuidv4()}.png`;
    const command = `ffmpeg -i "${videoUrl}" -ss 00:00:01.000 -vframes 1 "${outputFileName}"`;
    await execAsync(command);
    return outputFileName;
};
