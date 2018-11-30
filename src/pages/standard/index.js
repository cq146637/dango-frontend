import React from 'react';
import {Card,Form,Button,Input,message, Modal, Table, InputNumber, Select} from 'antd'
import axios from './../../axios/index'
import Utils from './../../utils/utils';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

class Standard extends React.Component {

    state={
        dataSource: [],
        showModal: false,
        showModal1: false
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
            url:'/show_standard',
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

    // 打开标准信息模态框
    handleOpen = ((type) => {
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
                    _this.delete_standard(ids);
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
            editName: item.name,
            editDescription: item.description,
            editCost: item.cost
        })
    })

    // 添加标准信息
    handleSubmit = ()=>{
        let standardInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal: false
        })
        this.add_standard(standardInfo.name, standardInfo.description, standardInfo.cost);
    }

    // 保存修改信息
    handleEditSubmit = ()=> {
        let standardInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal1: false
        })
        this.edit_standard(standardInfo.idEdit, standardInfo.nameEdit, standardInfo.descriptionEdit, standardInfo.costEdit);
    }
    
    // 发送添加信息给后端服务器
    add_standard = (name, description, cost)=>{
        const params = {
            name,
            description,
            cost 
        }
        axios.post({
            url:'/add_standard',
            data: params
        }).then((res)=>{
            if(res.code == 200){
                message.success(`标准名：${name}  添加成功！`)
                this.request();
            } else {
                message.error(`结果：${res.msg}  添加失败！`)
            }
        })
    }

    // 发送修改信息给后端服务器
    edit_standard = (id, name, description, cost)=> {
        const _this = this
        const params = {
            id,
            name,
            description,
            cost 
        }
        axios.post({
            url:'/edit_standard',
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
                _this.delete_standard(ids);
            },
            onCancel(){
            }
        })
    }

    // 发送需要删除的标准信息给后台
    delete_standard = (ids)=>{
        axios.post({
            url:'/delete_standard',
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
                title:'id',
                key:'id',
                width:20,
                dataIndex:'id'
            },
            {
                title: '标准名',
                key: 'name',
                width:80,
                dataIndex: 'name'
            },
            {
                title: '描述',
                key: 'description',
                width:200,
                dataIndex: 'description'
            },
            {
                title: '开销',
                key: 'cost',
                width:10,
                dataIndex: 'cost'
            },
            {
                title: '创建时间',
                key: 'createTime',
                width:180,
                dataIndex: 'createTime'
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
                    title="标准信息修改"
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
                    <FormItem label="Id" {...formItemLayout} style={{display:'none'}}>
                            {
                                getFieldDecorator('idEdit', {
                                    initialValue: this.state.editId,
                                })(
                                    <Input style={{display:'none'}}/>
                                )
                            }
                        </FormItem>
                        <FormItem label="标准名" {...formItemLayout}>
                            {
                                getFieldDecorator('nameEdit', {
                                    initialValue: this.state.editName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '标准名不能为空'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入标准名" />
                                )
                            }
                        </FormItem>
                        <FormItem label="标准描述" {...formItemLayout}>
                            {
                                getFieldDecorator('descriptionEdit',{
                                    initialValue: this.state.editDescription,
                                })(
                                    <TextArea
                                        autosize={rowObject}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="开销" {...formItemLayout}>
                            {
                                getFieldDecorator('costEdit', {
                                    initialValue: this.state.editCost,
                                    
                                })(
                                    <InputNumber step={10} />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <Modal 
                    title="标准信息添加"
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
                        <FormItem label="标准名" {...formItemLayout}>
                            {
                                getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '标准名不能为空'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入标准名" />
                                )
                            }
                        </FormItem>
                        <FormItem label="标准描述" {...formItemLayout}>
                            {
                                getFieldDecorator('description',{
                                    initialValue:''
                                })(
                                    <TextArea
                                        autosize={rowObject}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="开销" {...formItemLayout}>
                            {
                                getFieldDecorator('cost', {
                                    initialValue: 100,
                                    
                                })(
                                    <InputNumber step={10} />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Standard);

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="标准名">
                    {
                        getFieldDecorator('searchStandar')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="开销">
                    {
                        getFieldDecorator('searchCost')(
                            <Select
                                style={{ width: 80 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">200内</Option>
                                <Option value="2">1000内</Option>
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