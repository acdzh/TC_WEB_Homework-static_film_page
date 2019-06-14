import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Affix, Button, Col, Divider, Icon, Input, Layout, Pagination, Row } from "antd";
import './index.css';
import 'antd/dist/antd.css'; 
const Search = Input.Search;
const data = require('./films.json');
const { Header, Footer,  Content} = Layout;
const root = document.getElementById('root');

// const hightLight = keywd =>{
//     var nodeList = root.getElementsByTagName('span');
//     const re = new RegExp(keywd, "g");
//     const to_replace = '<span class="keyword">' + keywd + '</span>';
//     for (var i = 0; i < nodeList.length; i++) {
//         if(nodeList[i].childNodes.length === 1 && nodeList[i].childNodes[0].nodeType === Node.TEXT_NODE && nodeList[i].className !== "keyword"){
//             nodeList[i].innerHTML = nodeList[i].innerHTML.replace(re, to_replace);
//         }
//     }
//     nodeList = root.getElementsByTagName('a');
//     for (var i = 1; i < nodeList.length; i++) {
//         nodeList[i].innerHTML = nodeList[i].innerHTML.replace(re, to_replace);
//     }
//     nodeList = root.getElementsByTagName('h2');
//     for (var i = 0; i < nodeList.length; i++) {
//         nodeList[i].innerHTML = nodeList[i].innerHTML.replace(re, to_replace);
//     }
// } //react无法做到搜索到的关键字高亮, 回归原生js会出现冲突, 此函数废弃

const MovieImage = (props) => <img src={props.src} alt={props.title} style={{height: "170px"}} onError={(e)=>{e.target.onerror = null; e.target.src="https://s2.ax1x.com/2019/04/28/EMuGLj.png"}} />;

class Objects extends React.Component{
    static defaultProps = { haslink: true, less: true };
    render(){
        const less = this.props.less;
        const objects = this.props.objects.length > 4 && less ? this.props.objects.slice(0, 4) : this.props.objects;
        const objectList = [];
        const haslink = this.props.haslink;
        for(let i in objects){
            const sep = parseInt(i)  === objects.length - 1 ? "" : " / ";
            objectList.push(<span key={i}>{haslink ? <a href={"https://movie.douban.com/celebrity/"+ objects[i].id}>{objects[i].name}</a> : <span>{objects[i]}</span>}{sep}</span>);
        }
        if(this.props.objects.length > 4 && less){ objectList.push(<span>/ ...</span>) }
        return(
            <div>
                <span><span className="pl">{this.props.title}</span>  : </span>
                { haslink ? <span className="attrs">{objectList}</span> : <span>{objectList}</span> }
            </div>
        );
    }
}

class MovieDetail extends React.Component{
    static defaultProps = { less: true };
    render() { return(
        <div className="info">
            <Objects title="导演" objects={this.props.values.directors} />
            <Objects title="编剧" objects={this.props.values.writers} />
            <Objects title="主演" objects={this.props.values.casts} />
            <Objects title="类型" less={false} haslink={false} objects={this.props.values.genres} />
            <Objects title="语言" haslink={false} objects={this.props.values.languages} display="false"/>
        </div>
    );}
}

const MovieStarDetail = props => (
    <div>
        <span className="starstop"> 5星 </span>
        <div className="power" style={{width: props.star + "px"}}></div>
        <span className="rating_per">{props.star}%</span><br />
    </div>
);

const MovieStar = props => {
        const rating = props.values.rating;
        const rating_people = rating.rating_people === "" ? "0" : rating.rating_people;
        const rating_avg = rating.average === "" ? "NaN" : rating.average;
        var stars_5, stars_4, stars_3, stars_2, stars_1 = "0"; 
        if(rating.stars !== []){
            stars_5 = rating.stars[0]; 
            stars_4 = rating.stars[1];
            stars_3 = rating.stars[2];
            stars_2 = rating.stars[3];
            stars_1 = rating.stars[4];
        }
        const star_str = (Math.round(rating_avg) * 5).toString();
        const star_class = "bigstar" + (rating.rating_people === "" ? "00" :  (star_str[0] + star_str[1]));
        return(
            <div className="rating_wrap">
                <div className="rating_self">
                    <strong className="rating_num">{rating_avg} </strong>
                    <div className="rating_right">
                        <div className={star_class}></div>
                        <div className="rating_sum">{rating_people}人评价</div>
                    </div>
                </div>
                <div className="ratings-on-weight">
                    <MovieStarDetail star={stars_5}/>
                    <MovieStarDetail star={stars_4}/>
                    <MovieStarDetail star={stars_3}/>
                    <MovieStarDetail star={stars_2}/>
                    <MovieStarDetail star={stars_1}/>
                </div>
            </div>
        );

}

class MovieCard extends React.Component{
    onclick = () => { this.props.setId(this.props.id); };
    render(){
        const j = this.props.values;
        return(
            <div className="card" style={{ width: "100%" , boxShadow: "0 2px 8px #f0f1f2"}}>
                <Divider />
                <div className="cardbody">
                    <Row>
                        <Col lg={4} md={4} sm={24} xs={24}><MovieImage src={j.poster} title={j.title} /></Col>
                        <Col lg={14}  md={14} sm={14} xs={24}>
                            <h2 className="h2title">
                                <span>{j.title} </span><span className="year"> ({j.year})</span>
                            </h2>
                            <MovieDetail values={j}/>
                        </Col>
                        <Col lg={6}  md={6} sm={6} xs={24}><MovieStar values={j} /></Col>
                    </Row>
                </div>
                <div className="openmorebtn"> <Button size="small" onClick={this.onclick}>More ></Button></div>
            </div>
        );
    }
}

class Movies extends React.Component{
    constructor(props){
        super(props);
        this.state = {start: 0, end: 5};
    }
    setId = i =>{ this.props.setId(i); };
    onChange = (current, pageSize) => { this.setState( () => ({start: pageSize*(current-1), end: pageSize*current}) ); };
    render(){
        const data = this.props.values;
        const movieList = [];
        for(let i = this.state.start; i < this.state.end && i < data.length; i++){
            movieList.push(<span><MovieCard values={data[i]} id={i} setId={this.setId}/></span>)
        }
        return(
            <div style={{width: "100%"}}>
                {movieList}
                <br />
                <span style={{textAlign: "center"}}>
                    <Pagination showQuickJumper showSizeChanger 
                                defaultCurrent={1} total={data.length} defaultPageSize={5}
                                pageSizeOptions={['5', '10', '15', '20']}
                                onChange={this.onChange} onShowSizeChange={this.onChange}
                    />
                </span><br />
                <br />
            </div>
        );
    }
}

class Details extends React.Component{
    render(){
        const data = this.props.values;
        const j = data[this.props.id];
        return (
            <Affix offsetTop={8}>
            <div className="detailcard" style={{ width: "100%" , boxShadow: "0 2px 8px #f0f1f2"}}>
                <Divider />
                <div className="detailcardbody">
                    <h2 className="h2title">
                        <span>{j.title} </span>
                        <span className="year"> ({j.year})</span>
                    </h2>
                    <div className="info">
                    <Objects title="导演" less={false} objects={j.directors} />
                    <Objects title="编剧" less={false} objects={j.writers} />
                    <Objects title="主演" less={false} objects={j.casts} />
                    <Objects title="类型" less={false} haslink={false} objects={j.genres} />
                    <Objects title="国家" haslink={false} objects={j.countries} display="false"/>
                    <Objects title="语言" haslink={false} objects={j.languages} display="false"/>
                    <Objects title="上映日期" haslink={false} objects={j.pubdate} display="false"/>
                    <Objects title="别名" haslink={false} objects={j.aka[0]===""?["无"]:j.aka} display="false"/>
                    <div>
                    <span><span className="pl">外部链接</span> : </span>
                    <span>
                        <a href={"https://movie.douban.com/subject/"+j._id}>豆瓣 </a> , 
                        <a href={"https://www.imdb.com/title/"+j.imdb}> IMDB</a>
                    </span> 
                    </div>
                    <br />
                    <span><span className="pl">简介</span> : </span>
                    <span>{j.summary}</span> 
                </div>
                </div>
            </div>
            </Affix>
        );
    }
}

class MyContent extends React.Component{
    constructor(props){
        super(props);
        this.state= {id: 0};
    }
    setId = (i) => { this.setState({id: i}); }
    render(){
        const data = this.props.values;
        return(
            <Row>
                <Col lg={13} md={24} sm={24} xs={24}>
                    <Movies setId={this.setId} values={data}/>
                </Col>
                <Col lg={9} md={24} sm={24} xs={24} style={{paddingLeft: "80px"}}>
                    <Details id={this.state.id} values={data}/>
                </Col>
            </Row>
        );
    }
}



class MyHeader extends React.Component{
    render(){
        return(
            <div>
                <Row>
                    <Col span={3}> <a href="#" onClick={this.props.home} class="home"><h1> <Icon type="home" /> Movies</h1></a>
                    </Col>
                    <Col span={10}>                   
                        <Search
                            placeholder="Input search text"
                            onSearch={value=>this.props.search(value)}
                            style={{ width: 300 }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

class Page extends React.Component{
    constructor(props){
        super(props);
        this.state={values: data, noresult: false};
    };
    search = (str) =>{
        const indexList = [];
        for(let i = 0; i < 200; i++){
            if(JSON.stringify(data[i]).indexOf(str) > -1){ indexList.push(i); }
        }
        const Result = indexList.map(i=>data[i]);
        this.setState(indexList.length===0 ? {noresult: true} : {values:Result, noresult: false})
        
    }
    backHome = () =>{ this.setState({values: data, noresult: false}); }
    render(){
        return(
            <Layout style={{background: "#fff"}}>
                <Header style={{background: "#fff", boxShadow: "0 2px 8px #f0f1f2"}}>
                    <MyHeader home={this.backHome} search={this.search}/>
                </Header>
                <br />
                <Content style={{background: "#fff"}}>
                    { this.state.noresult ? <h2 style={{marginLeft:"40px"}}>无结果</h2> : <MyContent values={this.state.values} /> }
                </Content>
                <br />
                <Footer style={{ textAlign:'center', background: "#fff", boxShadow: "0 2px 8px #f0f1f2"}}>Web of Movies ©2019 Created by 1751130</Footer>
            </Layout>
        );
    }
}

ReactDOM.render(<Page /> , root);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
