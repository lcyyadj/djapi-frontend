import '@umijs/max';
import React, {useEffect, useState} from 'react';
import {listInterfaceInfoVoByPageUsingPost} from "@/services/djapi-backend/interfaceInfoController";
import ProCard from "@ant-design/pro-card";
import {Badge, Card, Image, List, Spin} from "antd";
import Search from "antd/es/input/Search";
import {history} from "@umijs/max";

const TableList: React.FC = () => {
    const [load,setLoading] =useState<boolean>(false)
    const [interfaceInfoList,setInterfaceInfoList]=useState<API.InterfaceInfo[]>()
    const [description,setDescription]=useState<string>("")
    const [total, setTotal] = useState<number>();//ascend,descend
    const initList=async (current=1)=>{
        setLoading(true)
        const res=await listInterfaceInfoVoByPageUsingPost({
            description: description,
            sortOrder: "descend",
            sortField: "totalCount",
            current: current,
            pageSize: 5,
        })
        if(res.code===0){
            setInterfaceInfoList(res?.data?.records)
            setTotal(res?.data?.total)
        }
        setLoading(false)
    }
    useEffect(()=>{
        initList()
    },[])
    return (
        <>
            <Card hoverable>
                <ProCard layout="center">
                    <Search
                        showCount
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        allowClear
                        size={"large"}
                        maxLength={50}
                        enterButton="搜索"
                        placeholder={"尝试搜索吧~"}
                        onSearch={initList}
                        style={{maxWidth: 600, height: 60}}/>
                </ProCard>
            </Card>
            <Spin spinning={load}>
                <List
                    pagination={{
                        onChange: (page) => {
                            initList(page)
                            // console.log(total+"  "+pageSize)

                        },
                        pageSize: 5,
                        total: total
                    }}
                    grid={{
                        gutter: 20,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 4,
                        xl: 5,
                        xxl: 6
                    }}
                    dataSource={interfaceInfoList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <ProCard key={index} bordered hoverable direction="column" style={{height: 270}}>
                                <ProCard layout="center" onClick={() => {
                                    history.push(`/interface_info/${item.id}`)
                                }}>
                                    <Badge count={item.totalCount} overflowCount={999} color='#eb4d4b'>
                                        <Image style={{width: 80, borderRadius: 8, marginLeft: 10}}
                                               src={item?.avatarUrl ?? "https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png"}
                                               fallback={"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png"}
                                               alt={item.name}
                                               preview={false}
                                        />
                                    </Badge>
                                </ProCard>
                                <ProCard onClick={() => {
                                    history.push(`/interface_info/${item.id}`)
                                }} layout="center" style={{marginTop: -10, fontSize: 16}}>
                                    {item.name}
                                </ProCard>
                                <ProCard onClick={() => {
                                    history.push(`/interface_info/${item.id}`)
                                }} layout="center" style={{marginTop: -18, fontSize: 14}}>
                                    {!item.description ? "暂无接口描述" : item.description.length > 15 ? item.description.slice(0, 15) + '...' : item.description}
                                </ProCard>
                            </ProCard>
                        </List.Item>
                    )}
                />
            </Spin>
        </>
    );
};
export default TableList;
