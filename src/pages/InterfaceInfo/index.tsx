import {PageContainer} from '@ant-design/pro-components';
import React, { useEffect, useState} from 'react';
import {Button, Card, Descriptions, Form, message, Divider, Image, Input} from 'antd';

import {useParams} from '@@/exports';
import {getInterfaceInfoByIdUsingGet, invokeInterfaceUsingPost} from "@/services/djapi-backend/interfaceInfoController";
import {EditableInput} from "@chenshuai2144/sketch-color/es/components/common";
/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  // const [invokeRes, setInvokeRes] = useState<any>({imgUrl: "https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png"});
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [totalInvokes, setTotalInvokes] = useState<number>(0);

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      if(res.data&&res.code===0){
        setTotalInvokes(res.data?.totalCount || 0)
        setData(res.data);
      }
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);
  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      console.log(values)
      const res = await invokeInterfaceUsingPost({
        id: params.id,
        ...values,
      });
      console.log(res)
      if(res.code===0){
        setInvokeRes(res.data);
        setTotalInvokes(totalInvokes+1);
        message.success('请求执行成功');
      }else{
        message.error(res.message)
      }

    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="接口信息">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
            <Descriptions.Item label="总调用次数">{totalInvokes}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider/>
      <Card title="在线测试" loading={loading}>
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea size={"large"}/>
          </Form.Item>
          <Form.Item wrapperCol={{span: 16}}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="返回结果" loading={invokeLoading}>
        {data?.name!=="img"?(invokeRes?.value?invokeRes.value:invokeRes?.text):<Image src={invokeRes?.imgurl}/>}
      </Card>
    </PageContainer>
  );
};

export default Index;
