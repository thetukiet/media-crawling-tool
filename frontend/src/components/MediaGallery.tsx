import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import styled from 'styled-components';
import {fetchMediaLinks} from "../services/mediaLinkService";
import {MediaLink} from "../modals/MediaLink";
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

  &::before {
    content: '▶';
    position: absolute;
    top: 8px;
    left: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 16px;
    visibility: ${props => props.type === 'video' ? 'visible' : 'hidden'};
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
`;

const MediaGallery: React.FC = () => {
    const [links, setLinks] = useState<MediaLink[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedLink, setSelectedLink] = useState<MediaLink | null>(null);

    useEffect(() => {
        fetchLinks();
    }, [page, pageSize]);

    const fetchLinks = async () => {
        try {
            const {links, paging} = await fetchMediaLinks(pageSize, page);
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

    return (
        <div>
            <MediaLinksGrid>
                {links.map((link) => (
                    <MediaLinkItem key={link.id} type={link.type} onClick={() => handleLinkClick(link)}>
                        <MediaLinkImage src={link.mediaUrl} alt={link.title} />
                        <MediaLinkTitle>{link.title}</MediaLinkTitle>
                    </MediaLinkItem>
                ))}
            </MediaLinksGrid>

            <ControlsContainer>
                <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                >
                    <MenuItem value={20}>20 per page</MenuItem>
                    <MenuItem value={30}>30 per page</MenuItem>
                    <MenuItem value={50}>50 per page</MenuItem>
                </Select>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </ControlsContainer>

            <Dialog open={!!selectedLink} onClose={handleCloseDialog}>
                <DialogTitle>{selectedLink?.title}</DialogTitle>
                <DialogContent>
                    {selectedLink?.type === 'image' ? (
                        <img src={selectedLink.mediaUrl} alt={selectedLink.title} style={{ maxWidth: '100%' }} />
                    ) : (
                        <ReactPlayer
                        url={selectedLink?.mediaUrl}
                        controls={true}
                        width="100%"
                        height="auto"
                        playing={false}
                        config={{
                            file: {
                                forceHLS: true,
                            }
                        }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MediaGallery;
// TODO: Optimize UI