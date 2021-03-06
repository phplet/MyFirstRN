/**
 *  Class: NewsListHeader
 *  Author: Niu Xiaoyu
 *  Date: 15/12/24.
 *  Description: 快讯栏目
 */
import React from 'react-native';
const { StyleSheet, Text, TouchableOpacity, View, Animated, Component, ScrollView, Dimensions} = React;
const TAB_COUNT_DISPLAY = 4;
const tabWidth = Dimensions.get('window').width / TAB_COUNT_DISPLAY;
const styles = StyleSheet.create({
  tab: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingBottom: 10,
  },

  tabContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

class NewsListHeader extends Component {
  static defaultProps = {
    tabHeight: 50,
    backgroundColor: 'white',
    paddingTop: 0
  };

  static propTypes = {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    underlineColor: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    containerWidth: React.PropTypes.number,
    scrollOffset: React.PropTypes.number,
    tabHeight: React.PropTypes.number
  };
  
  constructor(props) {
    super(props);
    this.displayTabs = [0, 1, 2, 3];
    this.state = {};
  }

  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'navy';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    return (
      <TouchableOpacity 
        style={[styles.tab, {width: this.props.containerWidth / TAB_COUNT_DISPLAY}]} 
        key={page} 
        onPress={() => this.props.goToPage(page)} >
        <View>
          <Text style={{color: isTabActive ? activeTextColor : inactiveTextColor,
            fontWeight: isTabActive ? 'bold' : 'normal'}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const offsetX = tabWidth * (this.props.activeTab - this.props.scrollOffset);
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offsetX, offsetX + tabWidth]
    });
    const tabUnderlineStyle = {
      position: 'absolute',
      width: tabWidth,
      height: 4,
      backgroundColor: this.props.underlineColor || 'navy',
      top: 18,
    };
    return (
      <View style={[styles.tabContainer, {backgroundColor: this.props.backgroundColor, height: this.props.tabHeight, paddingTop: this.props.paddingTop}]}>
        <ScrollView
          style={{height: 33, paddingTop: 9}}
          horizontal={true}
          bounces={false}
          ref={(scrollTab) => this.scrollTab = scrollTab}
          showsHorizontalScrollIndicator={false} >
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
          <Animated.View style={[tabUnderlineStyle, {left}]}/>
        </ScrollView>
      </View>
    );
  }

  scrollTabTo(page) {
    if (this.displayTabs.find((n) => n === page)) {
      return;
    }
    this.displayTabs = [];
    let displayStart = page === 0 ? 0 : page - 1;
    for (let i = 0; i < TAB_COUNT_DISPLAY; i++) {
      this.displayTabs.push(displayStart + i);
    }
    let pageNum = this.props.tabs.length;
    let maxOffset = (pageNum - TAB_COUNT_DISPLAY) * tabWidth;
    let offset = displayStart * tabWidth > maxOffset ? maxOffset : displayStart * tabWidth;

    this.scrollTab.scrollTo(0, offset);
  }
}

export default NewsListHeader;
