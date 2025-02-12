import api from './api';
import {MediaLink} from "../models/MediaLink";
import {Paging} from "../models/Paging";
import {ApiEndpoints} from "../constants/apiConstants";

interface FetchLinksResponse {
    data: MediaLink[];
    meta: Paging;
}

interface ProcessLinksResponse {
    message: string;
    links: MediaLink[];
}

export const fetchMediaLinks = async (pageSize: number, pageIndex: number, type: string | null, searchText: string | null): Promise<{ links: MediaLink[]; paging: Paging | null }> => {
    try {
        const response = await api.get<FetchLinksResponse>(ApiEndpoints.LINKS, {
            params: { pageSize, pageIndex, type, searchText },
        });
        const {data, meta} = response.data;
        return {links: data, paging: meta};
    } catch (error) {
        console.error('Error fetching links:', error);
        return {links:[], paging: null};
    }
};

export const processWebUrls = async (urls: string[]): Promise<MediaLink[] | null> => {
    try {
        const response = await api.post<ProcessLinksResponse>(ApiEndpoints.LINK_PROCESS, {urls:urls});
        const {links} = response.data;
        return links;
    } catch (error) {
        console.error('Error fetching links:', error);
        return null;
    }
};

