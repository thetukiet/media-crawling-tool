import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import styled from 'styled-components';
import { fetchMediaLinks } from "../services/mediaLinkService";
import { MediaLink } from "../models/MediaLink";
import ReactPlayer from 'react-player';

const MediaLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const MediaLinkItem = styled.div<{ type: 'image' | 'video' }>`
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const MediaLinkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaLinkTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.2s;

  ${MediaLinkItem}:hover & {
    opacity: 1;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
`;

const LeftControls = styled.div`
  display: flex;
  gap: 16px;
`;

const DialogImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

const DialogImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const DialogVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogVideo = styled(ReactPlayer)`
  max-width: 100%;
  max-height: 100%;
`;

const MediaGallery: React.FC = () => {
    const [links, setLinks] = useState<MediaLink[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedLink, setSelectedLink] = useState<MediaLink | null>(null);
    const [mediaType, setMediaType] = useState<'All' | 'Image' | 'Video'>('All');

    useEffect(() => {
        fetchLinks();
    }, [page, pageSize, mediaType]);

    const fetchLinks = async () => {
        try {
            const type = mediaType === 'All' ? null : mediaType.toLowerCase();
            const { links, paging } = await fetchMediaLinks(pageSize, page, type);
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
                <LeftControls>
                    <Select value={pageSize} onChange={handlePageSizeChange}>
                        <MenuItem value={20}>20 per page</MenuItem>
                        <MenuItem value={30}>30 per page</MenuItem>
                        <MenuItem value={50}>50 per page</MenuItem>
                    </Select>
                    <Select value={mediaType} onChange={handleMediaTypeChange}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Image">Image</MenuItem>
                        <MenuItem value="Video">Video</MenuItem>
                    </Select>
                </LeftControls>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
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
