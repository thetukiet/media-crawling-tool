import React, {useEffect, useState} from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import {toastUtil} from "../utils/toastUtil";
import {processWebUrls} from "../services/mediaLinkService";
import LoadingOverlay from "./LoadingoverLay";

const WebProcessor: React.FC = () => {
    const [urls, setUrls] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    useEffect(() => {
        setIsSubmitEnabled(urls.trim().length > 0);
    }, [urls]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const urlList = urls.split('\n').filter(url => url.trim() !== '');
        setIsLoading(true);
        try {
            const links = await processWebUrls(urlList);
            if (links === null) {
                toastUtil.error("Error occurs while processing the input web URLs");
            } else {
                if(links.length < 1){
                    toastUtil.info('No media link found');
                }else{
                    toastUtil.success('Web URLs processed successfully. New found links: ' + links.length);
                }

                setUrls('');
            }
        } catch (error) {
            toastUtil.error("An unexpected error occurred");
        } finally {
            // Hide loading
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading && <LoadingOverlay />}
            <Typography variant="h5">Crawling Images And Video From Web URLs</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    multiline
                    rows={10}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="Enter Web URLs (one per line)"
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" disabled={!isSubmitEnabled || isLoading}>
                    {isLoading ? 'Processing...' : 'Process'}
                </Button>
            </form>
        </div>
    );
};

export default WebProcessor;