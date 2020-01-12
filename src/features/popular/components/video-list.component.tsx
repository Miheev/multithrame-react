import React, { FC, Fragment, memo, ReactNode } from 'react';
import { History } from 'history';

import { VideoModel } from 'src/features/popular/models';
import { Video } from 'src/features/popular/components/video/video.component';

export interface VideoListProps {
  videoList: VideoModel[];
  history: History;
}

export function VideoListView(props: VideoListProps): ReactNode {
  // https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
  // let history = useHistory();

  return (
    <Fragment>
      {props.videoList.map(video => (
        <Video key={video.id} video={video} history={props.history}/>
      ))}
    </Fragment>
  );
}

// https://stackoverflow.com/questions/40909902/shouldcomponentupdate-in-function-components
export const VideoList = memo(VideoListView as FC<VideoListProps>);
