import React from 'react';
import {Card,Form,Button,Input,Select,message, Modal, Table, InputNumber, Badge} from 'antd'
import axios from './../../axios/index'
import Utils from './../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class Remark extends React.Component {

    state={
        dataSource: [],
        showModal: false,
        showModal1: false,
        standardList: [],
        orderAndCustomerList: [],
        statusList: [
            {
                'id': 0,
                'name': '空房'
            },
            {
                'id': 1,
                'name': '入住'
            }
        ]
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
            url:'/show_remark',
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

    // 获取房间标准
    requestStandard = ()=> {
        axios.post({
            url:'/get_room_standard',
            data: ''
        }).then((res)=>{
            if(res.code == 200){
                this.setState({
                    standardList: [...res.data]
                })
            } else {
                message.error(`获取房间标准失败！`)
            }
        })
    }

    // 获取订单和客户名称
    requestOrderAndCustomer = ()=> {
        axios.get({
            url:'/get_order_customer',
            data: ''
        }).then((res)=>{
            if(res.code == 200){
                this.setState({
                    orderAndCustomerList: [...res.data]
                })
            } else {
                message.error(`获取订单和客户失败！`)
            }
        })
    }

    // 打开标准信息模态框
    handleOpen = ((type) => {
        this.requestStandard();
        this.requestOrderAndCustomer();
        this.setState({
            [type]: true
        })
    })

    // 多选执行删除动作
    handleDelete = (()=>{
        const _this = this 
        let rows = this.state.selectedRows;
        let ids = [];
        if (rows!=null && rows!=[] && rows != '') {
            rows.map((item)=>{
                ids.push(item.id)
            })
            Modal.confirm({
                title:'删除提示',
                content: `您确定要删除这些数据吗`,
                onOk:()=>{
                    _this.delete_remark(ids);
                    message.success('删除成功');
                    this.request();
                }
            })
        }
    })

    // 发送删除信息给后台
    handleDeleteOne = ((type, cur_item) => {
        this.handleDeleteConfirm(type, [cur_item.id]);
        
    })

    // 修改单条信息
    handleEditOne =((item) => {
        this.setState({
            showModal1: true,
            editId: item.id,
            editOrderInfoId: item.orderInfoId,
            editCustomerRealName: item.customerRealName,
            editStandardId: item.standardId,
            editStandardName: item.standardName,
            editContent: item.content
        })
    })

    // 添加房间信息
    handleSubmit = ()=>{
        let remarkInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal: false
        })
        this.add_remark(remarkInfo.orderInfoId, remarkInfo.standardId, remarkInfo.content);
    }

    // 保存修改信息
    handleEditSubmit = ()=> {
        let remarkInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal1: false
        })
        this.edit_remark(remarkInfo.idEdit, remarkInfo.orderInfoIdEdit, remarkInfo.standardIdEdit, remarkInfo.contentEdit);
    }
    
    // 发送添加信息给后端服务器
    add_remark = (orderInfoId, standardId, content)=>{
        const params = {
            orderInfoId,
            standardId,
            content
        }
        axios.post({
            url:'/add_remark',
            data: params
        }).then((res)=>{
            if(res.code == 200){
                message.success(`评论添加成功！`)
                this.request();
            } else {
                message.error(`结果：${res.msg}  添加失败！`)
            }
        })
    }

    // 发送修改信息给后端服务器
    edit_remark = (id, orderInfoId, standardId, content)=> {
        const _this = this
        const params = {
            id,
            orderInfoId,
            standardId,
            content
        }
        axios.post({
            url:'/edit_remark',
            data: params
        }).then((res)=>{
            if(res.code == 200){
                message.success(`修改成功！`)
                _this.request();
            } else {
                message.error(`修改失败！`)
            }
        })
    }

    // 删除确认处理
    handleDeleteConfirm = (type, ids)=>{
        const _this = this
        Modal[type]({
            title:'确认？',
            content:'您确定删除选中的标准信息？',
            onOk(){
                _this.delete_remark(ids);
            },
            onCancel(){
            }
        })
    }

    // 发送需要删除的标准信息给后台
    delete_remark = (ids)=>{
        axios.post({
            url:'delete_remark',
            data: ids
        }).then((res)=>{
            if(res.code == 200){
                message.success(`删除成功！`)
                this.request();
            } else {
                message.error(`删除失败！`)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{
                xs:24,
                sm:7
            },
            wrapperCol:{
                xs:24,
                sm:12
            }
        }
        const offsetLayout = {
            wrapperCol:{
                xs:24,
                sm:{
                    span:12,
                    offset:4
                }
            }
        }
        
        const columns = [
            {
                title:'Id',
                key:'id',
                width:40,
                dataIndex:'id'
            },
            {
                title: '订单号',
                key: 'orderInfoId',
                width:80,
                dataIndex: 'orderInfoId'
            },
            {
                title: '客户名称',
                key: 'customerRealName',
                width:80,
                dataIndex: 'customerRealName'
            },
            {
                title: '标准id',
                key: 'standardId',
                width:80,
                dataIndex: 'standardId'
            },
            {
                title: '标准名称',
                key: 'standardName',
                width:80,
                dataIndex: 'standardName'
            },
            {
                title: '评价内容',
                key: 'content',
                width:180,
                dataIndex: 'content'
            },
            {
                title: '操作',
                width: 190,
                render:(text,item,index)=>{
                    return (
                        <div>
                            <Button size="small" icon="edit" onClick={() => { this.handleEditOne(item) }}>修改</Button>
                            <Button size="small" icon="delete" type="danger" onClick={() => { this.handleDeleteOne("confirm" ,item) }}>删除</Button>
                        </div>
                    )
                }
            }
        ]

        const selectedRowKeys = this.state.selectedRowKeys;

        const rowCheckSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        }

        const rowObject = {
            minRows: 4, maxRows: 6
        }

        return (
            <div>
                <Card>
                    <FilterForm />
                </Card>
                <Card title="" style={{ margin: '10px 0' }}>
                    <div style={{marginBottom:10}}>
                        <Button icon="plus" type="primary" onClick={() =>this.handleOpen('showModal')}>添加</Button>
                        <Button icon="delete" type="danger" onClick={() => this.handleDelete(this)}>删除</Button>
                    </div>
                    <Table
                        bordered
                        rowSelection={rowCheckSelection}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        scroll={{y:380}}
                    />
                </Card>
                <Modal 
                    title="评论信息修改"
                    visible={this.state.showModal1}
                    okText="保存"
                    cancelText="取消"
                    onOk={this.handleEditSubmit}
                    onCancel={() => {
                        this.setState({
                            showModal1: false
                        })  
                    }}
                >
                    <Form layout="horizontal">
                        <FormItem label="评论Id" {...formItemLayout}>
                            {
                                getFieldDecorator('idEdit', {
                                    initialValue: this.state.editId,
                                })(
                                    <Input readOnly={true} />
                                )
                            }
                        </FormItem>
                        <FormItem label="客户名称" {...formItemLayout}>
                            {
                                getFieldDecorator('orderInfoIdEdit', {
                                    initialValue: this.state.editOrderInfoId,
                                })(
                                    <Select>
                                        <Option value={this.state.editOrderInfoId}>{this.state.editCustomerRealName}</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="房间标准" {...formItemLayout}>
                        {
                                getFieldDecorator('standardIdEdit', {
                                    initialValue: this.state.editStandardId,
                                })(
                                    <Select>
                                        <Option value={this.state.editStandardId}>{this.state.editStandardName}</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="评论内容" {...formItemLayout}>
                            {
                                getFieldDecorator('contentEdit',{
                                    initialValue:this.state.editContent,
                                    rules: [
                                        {
                                            required: true,
                                            message: '评论不能为空'
                                        }
                                    ]
                                })(
                                    <TextArea
                                        autosize={rowObject}
                                    />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <Modal 
                    title="评论信息添加"
                    visible={this.state.showModal}
                    okText="添加"
                    cancelText="取消"
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.setState({
                            showModal: false
                        })
                    }}
                >
                    <Form layout="horizontal">
                        <FormItem label="客户名称" {...formItemLayout}>
                        {
                                getFieldDecorator('orderInfoId', {
                                    initialValue: 1
                                })(
                                    <Select>
                                        {this.state.orderAndCustomerList.map((item)=>{
                                            return <Option value={item.orderInfoId}>{item.customerRealName}</Option>
                                        })}
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="房间标准" {...formItemLayout}>
                        {
                                getFieldDecorator('standardId', {
                                    initialValue: 1
                                })(
                                    <Select>
                                        {this.state.standardList.map((item)=>{
                                            return <Option value={item.id}>{item.name}</Option>
                                        })}
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="评论内容" {...formItemLayout}>
                            {
                                getFieldDecorator('content',{
                                    initialValue:'',
                                    rules: [
                                        {
                                            required: true,
                                            message: '评论不能为空'
                                        }
                                    ]
                                })(
                                    <TextArea
                                        autosize={rowObject}
                                    />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Remark);


class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="客户">
                    {
                        getFieldDecorator('searchCustomer')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">猫</Option>
                                <Option value="2">团子</Option>
                                <Option value="3">李易峰</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="房间标准">
                    {
                        getFieldDecorator('searchStandard')(
                            <Select
                                style={{ width: 120 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">总统套房</Option>
                                <Option value="2">单人间</Option>
                            </Select>
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