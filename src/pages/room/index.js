import React from 'react';
import {Card,Form,Button,Input,Select,message, Modal, Table, InputNumber, Badge} from 'antd'
import axios from './../../axios/index'
import Utils from './../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class Room extends React.Component {

    state={
        dataSource: [],
        showModal: false,
        showModal1: false,
        standardList: [],
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
            url:'/show_room',
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

    // 打开标准信息模态框
    handleOpen = ((type) => {
        this.requestStandard();
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
        this.requestStandard();
        this.setState({
            showModal1: true,
            editId: item.id,
            editLabel: item.label,
            editPeopleCount: item.peopleCount,
            editStandardId: item.standardId,
            editStatus: item.status
        })
    })

    // 添加房间信息
    handleSubmit = ()=>{
        let roomInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal: false
        })
        this.add_room(roomInfo.label, roomInfo.peopleCount, roomInfo.standardId, 0);
    }

    // 保存修改信息
    handleEditSubmit = ()=> {
        let roomInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal1: false
        })
        this.edit_standard(roomInfo.idEdit, roomInfo.labelEdit, roomInfo.peopleCountEdit, roomInfo.standardIdEdit, roomInfo.statusEdit);
    }
    
    // 发送添加信息给后端服务器
    add_room = (label, peopleCount, standardId, status)=>{
        const params = {
            label,
            peopleCount,
            standardId,
            status
        }
        axios.post({
            url:'/add_room',
            data: params
        }).then((res)=>{
            if(res.code == 200){
                message.success(`房间号：${label}  添加成功！`)
                this.request();
            } else {
                message.error(`结果：${res.msg}  添加失败！`)
            }
        })
    }

    // 发送修改信息给后端服务器
    edit_standard = (id, label, peopleCount, standardId, status)=> {
        const _this = this
        const params = {
            id,
            label,
            peopleCount,
            standardId,
            status
        }
        axios.post({
            url:'/edit_room',
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
            url:'delete_rooms',
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
                title: '房间号',
                key: 'label',
                width:80,
                dataIndex: 'label'
            },
            {
                title: '人数',
                key: 'peopleCount',
                width:40,
                dataIndex: 'peopleCount'
            },
            {
                title: '标准id',
                key: 'standardId',
                width:40,
                dataIndex: 'standardId'
            },
            {
                title: '标准名称',
                key: 'standardName',
                width:180,
                dataIndex: 'standardName'
            },
            {
                title: '状态',
                dataIndex: 'status',
                width:80,
                render(status) {
                    let config = {
                        '0': <Badge status="success" text="空房"/>,
                        '1': <Badge status="warning" text="入住" />
                    }
                    return config[status];
                }
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
                        <FormItem label="房间Id" {...formItemLayout}>
                            {
                                getFieldDecorator('idEdit', {
                                    initialValue: this.state.editId,
                                })(
                                    <Input readOnly={true} />
                                )
                            }
                        </FormItem>
                        <FormItem label="房间号" {...formItemLayout}>
                            {
                                getFieldDecorator('labelEdit', {
                                    initialValue: this.state.editLabel,
                                    rules: [
                                        {
                                            required: true,
                                            message: '房间号不能为空'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入房间号" />
                                )
                            }
                        </FormItem>
                        <FormItem label="入住人数" {...formItemLayout}>
                            {
                                getFieldDecorator('peopleCountEdit', {
                                    initialValue: this.state.editPeopleCount,
                                    
                                })(
                                    <InputNumber step={1} />
                                )
                            }
                        </FormItem>
                        <FormItem label="房间标准" {...formItemLayout}>
                        {
                                getFieldDecorator('standardIdEdit', {
                                    initialValue: this.state.editStandardId,
                                })(
                                    <Select>
                                        {this.state.standardList.map((item)=>{
                                            return <Option value={item.id}>{item.name}</Option>
                                        })}
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="当前状态" {...formItemLayout}>
                        {
                                getFieldDecorator('statusEdit', {
                                    initialValue: this.state.editStatus,
                                })(
                                    <Select>
                                        {this.state.statusList.map((item)=>{
                                            return <Option value={item.id}>{item.name}</Option>
                                        })}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <Modal 
                    title="房间信息添加"
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
                        <FormItem label="房间号" {...formItemLayout}>
                            {
                                getFieldDecorator('label', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '房间号不能为空'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入房间号" />
                                )
                            }
                        </FormItem>
                        <FormItem label="入住人数" {...formItemLayout}>
                            {
                                getFieldDecorator('peopleCount', {
                                    initialValue: 1,
                                    
                                })(
                                    <InputNumber step={1} />
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
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Room);

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
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
                <FormItem label="入住人数">
                    {
                        getFieldDecorator('searchPeopleCount')(
                            <Select
                                style={{ width: 80 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">限3人</Option>
                                <Option value="2">限10人</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="房间状态">
                    {
                        getFieldDecorator('searchStatus')(
                            <Select
                                style={{ width: 100 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">空房</Option>
                                <Option value="2">入住</Option>
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