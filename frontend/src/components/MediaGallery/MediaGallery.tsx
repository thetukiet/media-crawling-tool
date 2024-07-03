import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { fetchMediaLinks } from "../../services/mediaLinkService";
import { MediaLink } from "../../models/MediaLink";

import {
    MediaLinksGrid,
    MediaLinkItem,
    MediaLinkImage,
    MediaLinkTitle,
    ControlsContainer,
    GroupControls,
    DialogImageWrapper,
    DialogImage,
    DialogVideoWrapper,
    DialogVideo
} from './MediaGallery.styles';

const MediaGallery: React.FC = () => {
    const [links, setLinks] = useState<MediaLink[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedLink, setSelectedLink] = useState<MediaLink | null>(null);
    const [mediaType, setMediaType] = useState<'All' | 'Image' | 'Video'>('All');
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetchLinks();
    }, [page, pageSize, mediaType, searchText]);

    const fetchLinks = async () => {
        try {
            const type = mediaType === 'All' ? null : mediaType.toLowerCase();
            const searchValue = searchText.trim() === '' ? null : searchText.trim();
            const { links, paging } = await fetchMediaLinks(pageSize, page, type, searchValue);
            let totalPages = paging == null ? 0 : paging.totalPages;
            setLinks(links);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const handleLinkClick = (link: MediaLink) => {
        setSelectedLink(link);
    };

    const handleCloseDialog = () => {
        setSelectedLink(null);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        setPageSize(event.target.value as number);
        setPage(1);
    };

    const handleMediaTypeChange = (event: SelectChangeEvent<'All' | 'Image' | 'Video'>) => {
        setMediaType(event.target.value as 'All' | 'Image' | 'Video');
        setPage(1);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        setPage(1);
    };

    const renderThumbnail = (link: MediaLink) => {
        if (link.type === 'video') {
            if(link.thumbnail){
                return (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <MediaLinkImage src={link.thumbnail} alt={link.title} />
                        <span
                            style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '16px',
                            }}
                        >
              ▶
            </span>
                    </div>
                );
            } else {
                return <MediaLinkImage src="/video-placeholder.svg" alt={link.title} />;
            }
        } else {
            if(link.thumbnail) {
                return <MediaLinkImage src={link.thumbnail} alt={link.title}/>;
            } else{
                return <MediaLinkImage src={link.mediaUrl} alt={link.title}/>;
            }
        }
    };

    return (
        <div>
            <ControlsContainer>
                <GroupControls>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchText}
                        onChange={handleSearchChange}
                        size="medium"
                        style={{ marginRight: '10px', width: '300px' }}
                    />
                    <Select value={mediaType} onChange={handleMediaTypeChange}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Image">Image</MenuItem>
                        <MenuItem value="Video">Video</MenuItem>
                    </Select>
                </GroupControls>
                <GroupControls>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} />
                    <Select value={pageSize} onChange={handlePageSizeChange}>
                        <MenuItem value={20}>20 per page</MenuItem>
                        <MenuItem value={30}>30 per page</MenuItem>
                        <MenuItem value={50}>50 per page</MenuItem>
                    </Select>
                </GroupControls>
            </ControlsContainer>

            <MediaLinksGrid>
                {links.map((link) => (
                    <MediaLinkItem key={link.id} type={link.type} onClick={() => handleLinkClick(link)}>
                        {renderThumbnail(link)}
                        <MediaLinkTitle>{link.title}</MediaLinkTitle>
                    </MediaLinkItem>
                ))}
            </MediaLinksGrid>

            <Dialog open={!!selectedLink} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>{selectedLink?.title}</DialogTitle>
                <DialogContent>
                    {selectedLink?.type === 'image' ? (
                        <DialogImageWrapper>
                            <DialogImage src={selectedLink.mediaUrl} alt={selectedLink.title} />
                        </DialogImageWrapper>
                    ) : (
                        <DialogVideoWrapper>
                            <DialogVideo
                                url={selectedLink?.mediaUrl}
                                controls={true}
                                width="100%"
                                height="auto"
                                playing={false}
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: 'nodownload'  // Prevent downloading
                                        }
                                    }
                                }}
                            />
                        </DialogVideoWrapper>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MediaGallery;
