import React from 'react';
import {Card,Form,Button,Input,Select,message, Modal, Table, InputNumber, Badge, Cascader, DatePicker} from 'antd'
import axios from './../../axios/index'
import Utils from './../../utils/utils';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class Order extends React.Component {

    state={
        dataSource: [],
        showModal: false,
        showModal1: false,
        standardAndRoomList: [],
        customerList: [],
        statusList: [
            {
                'id': 0,
                'name': '已预订'
            },
            {
                'id': 1,
                'name': '已入住'
            },
            {
                'id': 2,
                'name': '已退房'
            },
        ],
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
            url:'/show_order_info',
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

    // 获取房间标准和房间
    requestStandardAndRoom = ()=> {
        axios.post({
            url:'/get_order_standard_and_room',
            data: ''
        }).then((res)=>{
            if(res.code == 200){
                this.setState({
                    standardAndRoomList: [...res.data]
                })
            } else {
                message.error(`获取房间标准和房间失败！`)
            }
        })
    }

    // 获取客户列表
    requestCustomer = ()=> {
        axios.get({
            url:'/show_customer',
            data: ''
        }).then((res)=>{
            if(res.code == 200){
                this.setState({
                    customerList: [...res.data.data]
                })
            } else {
                message.error(`获取房间标准和房间失败！`)
            }
        })
    }

    // 打开标准信息模态框
    handleOpen = ((type) => {
        this.requestCustomer();
        this.requestStandardAndRoom();
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
                    _this.delete_order(ids);
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
        this.requestStandardAndRoom();
        this.requestCustomer();
        this.setState({
            showModal1: true,
            editId: item.id,
            editRoomId: item.roomId,
            editStandardId: item.standardId,
            editCustomerId: item.customerId,
            editStartTime: item.startTime,
            editEndTime: item.endTime,
            editStatus: item.status,
            standardAndRoomList: [...this.state.standardAndRoomList, {
                "value": item.standardId,
                "label": item.standardName,
                "children": {
                    "value": item.roomId,
                    "label": item.roomLabel,
                    "children": null
                }
            }]
        })
    })

    // 添加房间信息
    handleSubmit = ()=>{
        let orderInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal: false
        })
        this.add_order(orderInfo.customerId, orderInfo.roomId, orderInfo.startTime, orderInfo.endTime, 0);
    }

    // 保存修改信息
    handleEditSubmit = ()=> {
        let orderInfo = this.props.form.getFieldsValue();
        this.setState({
            showModal1: false
        })
        this.edit_standard(orderInfo.idEdit, orderInfo.customerIdEdit, orderInfo.roomIdEdit, orderInfo.startTimeEdit, orderInfo.endTimeEdit);
    }
    
    // 发送添加信息给后端服务器
    add_order = (customerId, roomId, startTime, endTime, status)=>{
        if (roomId.length == 2) {
            roomId = roomId[1];
            const params = {
                customerId,
                roomId,
                startTime,
                endTime,
                status
            }
            axios.post({
                url:'/add_order',
                data: params
            }).then((res)=>{
                if(res.code == 200){
                    message.success(`订单添加成功！`)
                    this.request();
                } else {
                    message.error(`结果：${res.msg}  订单添加失败！`)
                }
            })
        } else {
            message.error("请选择房间!")
        }
        
    }

    // 发送修改信息给后端服务器
    edit_standard = (id, customerId, roomId, startTime, endTime)=> {
        if (roomId.length == 2) {
            roomId = roomId[1];
            const _this = this
            const params = {
                id,
                customerId,
                roomId,
                startTime,
                endTime
            }
            axios.post({
                url:'/edit_order_info',
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
    }

    // 删除确认处理
    handleDeleteConfirm = (type, ids)=>{
        const _this = this
        Modal[type]({
            title:'确认？',
            content:'您确定删除选中的标准信息？',
            onOk(){
                _this.delete_order(ids);
            },
            onCancel(){
            }
        })
    }

    // 发送需要删除的标准信息给后台
    delete_order = (ids)=>{
        axios.post({
            url:'delete_order',
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
                title: '客户名称',
                key: 'customerRealName',
                width:100,
                fixed:'left',
                dataIndex: 'customerRealName'
            },
            {
                title:'订单Id',
                key:'id',
                width:80,
                dataIndex:'id'
            },
            {
                title: '客户Id',
                key: 'customerId',
                width:80,
                dataIndex: 'customerId'
            },
            {
                title: '标准ID',
                key: 'standardId',
                width:80,
                dataIndex: 'standardId'
            },
            {
                title: '房间标准',
                key: 'standardName',
                width:100,
                dataIndex: 'standardName'
            },
            {
                title: '房间ID',
                key: 'roomId',
                width:80,
                dataIndex: 'roomId'
            },
            {
                title: '房间号',
                key: 'roomLabel',
                width:100,
                dataIndex: 'roomLabel'
            },
            {
                title: '客户身份证',
                key: 'customerIdentityCard',
                width:150,
                dataIndex: 'customerIdentityCard'
            },
            {
                title: '客户手机号',
                key: 'customerPhone',
                width:150,
                dataIndex: 'customerPhone'
            },
            {
                title: '预计入住时间',
                key: 'startTime',
                width:240,
                dataIndex: 'startTime'
            },
            {
                title: '预计退房时间',
                key: 'endTime',
                width:240,
                dataIndex: 'endTime'
            },
            {
                title: '创建时间',
                key: 'createTime',
                width:240,
                dataIndex: 'createTime'
            },
            {
                title: '状态',
                dataIndex: 'status',
                width:120,
                fixed: 'right',
                render(status) {
                    let config = {
                        '0': <Badge status="success" text="已预订"/>,
                        '1': <Badge status="warning" text="已入住" />,
                        '2': <Badge status="error" text="已退房" />
                    }
                    return config[status];
                }
            },
            {
                title: '操作',
                width: 190,
                fixed:'right',
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
                        pagination={true}
                        scroll={{y:380}}
                        scroll={{ x: 2000 }}
                    />
                </Card>
                <Modal 
                    title="订单信息修改"
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
                        <FormItem label="订单ID" {...formItemLayout}>
                            {
                                getFieldDecorator('idEdit', {
                                    initialValue: this.state.editId,
                                })(
                                    <Input readOnly={true}/>
                                )
                            }
                        </FormItem>
                        
                        <FormItem label="选择客户" {...formItemLayout}>
                            {
                                getFieldDecorator('customerIdEdit', {
                                    initialValue: this.state.editCustomerId,
                                })(
                                    <Select>
                                        {this.state.customerList.map((item)=>{
                                            return <Option value={item.id}>{item.realName}</Option>
                                        })}
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="选择房间" {...formItemLayout}>
                            {
                                getFieldDecorator('roomIdEdit', {
                                    initialValue: [this.state.editStandardId+"", this.state.editRoomId+""],
                                    rules: [{ type: 'array', required: true, message: '请选择房间预订!' }],
                                })(
                                    <Cascader options={this.state.standardAndRoomList} />
                                )
                            }
                        </FormItem>
                        <FormItem label="入住时间" {...formItemLayout}>
                            {
                                getFieldDecorator('startTimeEdit',{
                                    initialValue: moment(this.state.editStartTime),
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="退房时间" {...formItemLayout}>
                            {
                                getFieldDecorator('endTimeEdit',{
                                    initialValue: moment(this.state.editEndTime),
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
                <Modal 
                    title="订单信息添加"
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
                        <FormItem label="选择客户" {...formItemLayout}>
                            {
                                getFieldDecorator('customerId', {
                                    initialValue: 1
                                })(
                                    <Select>
                                        {this.state.customerList.map((item)=>{
                                            return <Option value={item.id}>{item.realName}</Option>
                                        })}
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="选择房间" {...formItemLayout}>
                            {
                                getFieldDecorator('roomId', {
                                    initialValue: [1],
                                    rules: [{ type: 'array', required: true, message: '请选择房间预订!' }],
                                })(
                                    <Cascader options={this.state.standardAndRoomList} />
                                )
                            }
                        </FormItem>
                        <FormItem label="入住时间" {...formItemLayout}>
                            {
                                getFieldDecorator('startTime',{
                                    initialValue:moment()
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="退房时间" {...formItemLayout}>
                            {
                                getFieldDecorator('endTime',{
                                    initialValue:moment()
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="当前状态" {...formItemLayout}>
                            {
                                getFieldDecorator('customerId', {
                                    initialValue: this.state.editStatus
                                })(
                                    <Select>
                                        {this.state.statusList.map((item)=>{
                                            return <Option value={item.id}>{item.realName}</Option>
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

export default Form.create()(Order);

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
                <FormItem label="入住时间">
                    {
                        getFieldDecorator('searchStartTime')(
                            <Select
                                style={{ width: 80 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">一周内</Option>
                                <Option value="2">一个月内</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="退房时间">
                    {
                        getFieldDecorator('searchEndTime')(
                            <Select
                                style={{ width: 100 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">一周内</Option>
                                <Option value="2">一个月内</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="订单状态">
                    {
                        getFieldDecorator('searchStatus')(
                            <Select
                                style={{ width: 100 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">已预定</Option>
                                <Option value="2">已入住</Option>
                                <Option value="3">已退房</Option>
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