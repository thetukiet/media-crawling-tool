import styled from 'styled-components';
import ReactPlayer from 'react-player';

export const MediaLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
`;

export const MediaLinkItem = styled.div<{ type: 'image' | 'video' }>`
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

export const MediaLinkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MediaLinkTitle = styled.div`
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

export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
`;

export const LeftControls = styled.div`
  display: flex;
  gap: 16px;
`;

export const DialogImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

export const DialogImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

export const DialogVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DialogVideo = styled(ReactPlayer)`
  max-width: 100%;
  max-height: 100%;
`;
