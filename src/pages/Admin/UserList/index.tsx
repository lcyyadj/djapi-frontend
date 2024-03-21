
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useRef, useState } from 'react';
import {Card, message} from "antd";
import {banUserUsingGet, listUserByPageUsingPost, pickUserUsingGet} from "@/services/djapi-backend/userController";

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>();
  const _confirm=()=>{

  }
  const handleBanUser=async (id:API.IdRequest)=>{
    const res=await banUserUsingGet(id)
    if(res.code===0&&res.data){
      actionRef.current?.reload();
      message.success("禁用成功")
    }else{
      message.error("禁用失败")
    }
  }
  const handleNormalUser=async (id:API.IdRequest)=>{
    const res=await pickUserUsingGet(id)
    if(res.code===0&&res.data){
      actionRef.current?.reload();
      message.success("启用成功")
    }else{
      message.error("启用失败")
    }
  }

  const columns: ProColumns<API.UserVO>[] = [
    {
      dataIndex: 'id',
      valueType: 'index',
      hideInTable: true,
      key: 'id',
    },
    {
      title: '昵称',
      dataIndex: 'userName',
      copyable: true,
      ellipsis: true,
      key: 'userName',
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      valueType: 'text',
      copyable: true,
      key: 'userAccount',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'image',
      key: 'userAvatar',
      search: false
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      copyable: true,
      key: 'email',
    },
    {
      title: '积分',
      dataIndex: 'points',
      valueType: 'text',
      copyable: true,
      key: 'balance',
      // @ts-ignore
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: 'SecretKey',
      dataIndex: 'secretKey',
      valueType: 'textarea',
      copyable: true,
      ellipsis: true,
      key: 'secretKey',
      search: false
    },
    {
      title: 'AccessKey',
      dataIndex: 'accessKey',
      valueType: 'textarea',
      copyable: true,
      ellipsis: true,
      key: 'accessKey',
      search: false
    },
    {
      title: '角色/权限',
      dataIndex: 'userRole',
      key: 'userRole',
      filters: true,
      onFilter: true,
      valueEnum: {
        "admin": {
          text: '管理员',
          status: 'success'
        },
        "user": {
          text: '普通用户',
          status: 'default'
        }
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      key: 'updateTime',
      search: false
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      key: 'createTime',
      search: false
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.status === 1 ? (
            <a
                type="text"
                key="normal"
                onClick={() => {
                  handleNormalUser(record);
                }}
            >
              解封
            </a>
        ) : null,
        record.status === 0 ? (
            <a
                style={{color: "red"}}
                type="text"
                key="ban"
                onClick={() => {
                  handleBanUser(record);
                }}
            >
              封号
            </a>
        ) : null,
      ],
    },
  ];
  return (
      <Card>

        <ProTable<API.UserVO>
            headerTitle={'用户管理'}
            actionRef={actionRef}
            rowKey="user"
            loading={loading}
            search={{
              labelWidth: 120,
            }}
            pagination={{defaultPageSize: 10}}
            request={async (params) => {
              setLoading(true)
              const res = await listUserByPageUsingPost({...params});
              if (res.data) {
                setLoading(false)
                return {
                  data: res.data.records || [],
                  success: true,
                  total: res.data.total,
                };
              } else {
                return {
                  data: [],
                  success: false,
                  total: 0,
                };
              }
            }}
            columns={columns}
        />


      </Card>
  );
};
export default UserList;
