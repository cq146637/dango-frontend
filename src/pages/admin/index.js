import React from 'react';
import {Card,Form,Button,Select,Table,Input} from 'antd'
import axios from './../../axios/index'
import Utils from './../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;

class Administrator extends React.Component {

    state={
        dataSource: [], 
    }

    params = {
        page:1
    }

    componentDidMount() {
        this.request();
    }

    //动态获取mock数据
    request = ()=>{
        let _this = this;
        const params = {
            page:this.params.page
        }
        axios.ajax({
            url:'/show_adminstrator',
            method: 'get',
            data: params
        }).then((res)=>{
            if(res.code == 200){
                res.data.data.map((item, index) => {
                    item.key = index;
                })
                this.setState({
                    dataSource:res.data.data,
                    selectedRowKeys:[],
                    selectedRows:null,
                    pagination: Utils.pagination(res.data,(current)=>{
                        _this.params.page = current;
                        this.request();
                    })
                })
            }
        })
    }

    render() {
        const columns = [
            {
                title: 'id',
                key: 'id',
                width:80,
                dataIndex: 'id'
            },
            {
                title: '用户名',
                key: 'username',
                width: 80,
                dataIndex: 'username'
            },
            {
                title: '真实姓名',
                key: 'realName',
                width: 80,
                dataIndex: 'realName',
            },
            {
                title: '电话号码',
                key: 'phone',
                width: 80,
                dataIndex: 'phone',
            },
        ]

        return (
            <div>
                <Card>
                    <FilterForm />
                </Card>
                <Card title="" style={{ margin: '10px 0' }}>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        scroll={{y:380}}
                    />
                </Card>
            </div>
        );
    }
}

export default Administrator;

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="用户名">
                    {
                        getFieldDecorator('searchUsername')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="真实姓名">
                    {
                        getFieldDecorator('searchRealName')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="电话号码">
                    {
                        getFieldDecorator('searchPhone')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" style={{margin:'0 20px'}}>查询</Button>
                    <Button>重置</Button>
                </FormItem>
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);