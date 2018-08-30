import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import {Map} from 'immutable';

import {DEV_MODE} from '../constants';
import GraphPanel from './graph-panel';
import CommentPanel from './comment-panel';
import Header from './header';

class RootComponent extends React.Component {
  componentWillMount() {
    this.props.setFoundOrder(this.props.foundOrder);
    const rootItem = (window.location.search || '?id=17338700').split('?id=')[1];
    this.props.modelData(rootItem);
    // this.props.modelData(this.props.foundOrder.map(({textContent}) =>
    //   textContent.replace(/reply↵ /g, '').replace(/↵\s*/g, ''))
    // );
  }

  componentDidMount() {
    const rootItem = (window.location.search || '?id=17338700').split('?id=')[1];
    if (!DEV_MODE) {

      this.props.getItem(rootItem, true);
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.toRequest.equals(newProps.toRequest)) {
      newProps.toRequest.forEach(itemId => {
        newProps.startGetItem(itemId);
        newProps.getItem(itemId);
      });
    }
  }

  render() {
    const selectedMap = this.props.itemsToRender
      .reduce((acc, row) => acc.set(row.get('id'), true), Map());
    return (
      <div className="flex-down full-size" >
        <Header
          rootId={this.props.rootId}
          userKarma={this.props.userKarma}
          toggleGraphLayout={this.props.toggleGraphLayout}
          logoutLink={this.props.logoutLink}
          username={this.props.username}/>
        {this.props.loading && <div className="flex full-size background-gray centering">
          <h1>
            {`${Math.floor((this.props.responsesObserved / this.props.responsesExpected) * 100)}% loaded`}
          </h1>
        </div>}
        {
          !this.props.loading && <div
            className="flex full-size background-gray main-container">
            <GraphPanel
            graphLayout={this.props.graphLayout}
            data={this.props.data}
            setSelectedCommentPath={this.props.setSelectedCommentPath}
            selectedMap={selectedMap}
            hoveredComment={this.props.hoveredComment}
            toggleCommentSelectionLock={this.props.toggleCommentSelectionLock}
            commentSelectionLock={this.props.commentSelectionLock}
            />
            <CommentPanel
              setHoveredComment={this.props.setHoveredComment}
              setSelectedCommentPath={this.props.setSelectedCommentPath}
              itemPath={this.props.itemPath}
              itemsToRender={
                this.props.itemsToRender.size ? this.props.itemsToRender : this.props.data
              }/>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps({base}) {
  return {
    toRequest: base.get('toRequest'),
    data: base.get('data'),
    itemsToRender: base.get('itemsToRender'),
    itemPath: base.get('itemPath'),
    graphLayout: base.get('graphLayout'),
    loading: base.get('loading'),
    hoveredComment: base.get('hoveredComment'),
    commentSelectionLock: base.get('commentSelectionLock'),
    responsesExpected: base.get('responsesExpected'),
    responsesObserved: base.get('responsesObserved'),
    rootId: base.getIn(['data', 0, 'id'])
  };
}

export default connect(mapStateToProps, actionCreators)(RootComponent);
