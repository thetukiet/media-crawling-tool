import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { spawnSync } from 'child_process';

// Set the ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export class ThumbnailUtil {

    public static generateThumbnailBase64(videoUrl: string, timeInSeconds: number = 0): string | null {
        try {
            const ffmpegPath = ffmpegInstaller.path;
            const args = [
                '-i', videoUrl,
                '-ss', timeInSeconds.toString(),
                '-vframes', '1',
                '-f', 'image2pipe',
                '-vcodec', 'png',
                '-'
            ];

            const result = spawnSync(ffmpegPath, args, {encoding: 'buffer'});

            if (result.error) {
                throw result.error;
            }

            if (result.status !== 0) {
                throw new Error(`FFmpeg process exited with code ${result.status}: ${result.stderr.toString()}`);
            }

            const base64 = result.stdout.toString('base64');
            return `data:image/png;base64,${base64}`;
        } catch (er: Error){
            console.log(er);
            return null;
        }
    }

}