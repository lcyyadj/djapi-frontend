import { useModel} from '@umijs/max';
import {
  Button,
  Descriptions, Image,
  message,
  Modal,
  Spin,
  Tooltip,
  Tour,
  TourProps,
  UploadFile,
} from 'antd';
import React, {useEffect, useRef, useState} from 'react';

import Paragraph from "antd/lib/typography/Paragraph";
import {EditOutlined} from "@ant-design/icons";
import Settings from "../../../../config/defaultSettings";
import {
  getLoginUserUsingGet, updateMyUserUsingPost,
  userBindEmailUsingPost,
  userUnBindEmailUsingPost
} from "@/services/djapi-backend/userController";
import ProCard from "@ant-design/pro-card";
import EmailModal from "@/components/EmailModal";
import {updateInterfaceInfoUsingPost} from "@/services/djapi-backend/interfaceInfoController";
import {doDailyCheckInUsingPost} from "@/services/djapi-backend/dailyCheckInController";
export const valueLength = (val: any) => {
  return val && val.trim().length > 0
}
const UserInfo: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const {loginUser} = initialState || {}
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dailyCheckInLoading, setDailyCheckInLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png");
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);
  const [userName, setUserName] = useState<string | undefined>('');
  const [openEmailModal, setOpenEmailModal] = useState(false);

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const [openTour, setOpenTour] = useState<boolean>(false);

  const steps: TourProps['steps'] = [
    {
      title: '个人信息设置',
      description: <span>这里是你的账号信息，您可以便捷的查看您的基本信息。<br/>您还可以修改和更新昵称。</span>,
      target: () => ref1.current,
    },
    {
      title: '我的钱包',
      description: <span>这里是您的钱包，积分用于平台接口的调用费用，可以每日签到来获得积分</span>,
      target: () => ref2.current,
    },
  ];

  const loadData = async () => {
    setLoading(true)
    const res = await getLoginUserUsingGet();
    if (res.data && res.code === 0) {
      // @ts-ignore
      setPreviewImage(res.data.userAvatar)
      const updatedFileList = [...fileList];
      if (loginUser && loginUser.userAvatar) {
        updatedFileList[0] = {
          // @ts-ignore
          uid: loginUser?.userAccount,
          // @ts-ignore
          name: loginUser?.userAvatar?.substring(loginUser?.userAvatar!.lastIndexOf('-') + 1),
          status: "done",
          percent: 100,
          url: loginUser?.userAvatar
        }
        setFileList(updatedFileList);
      }
      setUserName(loginUser?.userName)
      setLoading(false)
    }
    // PC端显示指引
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setOpenTour(false)
    } else {
      const tour = localStorage.getItem('tour');
      if (!tour) {
        setOpenTour(true)
      }
    }
  }

  useEffect(() => {
      loadData()

    },
    [])

  const updateUserInfo = async () => {
    const res = await updateMyUserUsingPost({
      // @ts-ignore
      userAvatar: previewImage,
      userName: userName
    })
    if (res.data && res.code === 0) {
      setInitialState({loginUser: {userAvatar: previewImage,
          id: loginUser?.id,
          userName: userName}, settings: Settings})
      message.success(`信息更新成功`);
    }
  }

  const handleBindEmailSubmit = async (values: API.UserBindEmailRequest) => {
    try {
      // 绑定邮箱
      const res = await userBindEmailUsingPost({
        ...values,
      });
      if (res.data && res.code === 0) {
        setOpenEmailModal(false)
        setInitialState({loginUser: {...loginUser,email:values.emailAccount}, settings: Settings})
        message.success('绑定成功');
      }
    } catch (error) {
      const defaultLoginFailureMessage = '操作失败！';
      message.error(defaultLoginFailureMessage);
    }
  };
  const handleUnBindEmailSubmit = async (values: API.UserUnBindEmailRequest) => {
    try {
      // 绑定邮箱
      const res = await userUnBindEmailUsingPost({...values});
      if (res.data && res.code === 0) {
        setOpenEmailModal(false)
        message.success('解绑成功');
      }
    } catch (error) {
      const defaultLoginFailureMessage = '操作失败！';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <Spin spinning={loading}>
      <ProCard
        type="inner"
        bordered
        direction="column"
      >
        <ProCard
          ref={ref1}
          extra={
            <>
              <Tooltip title={"用于接收订单信息"}>
                <Button onClick={() => {
                  setOpenEmailModal(true)
                }
                }>{loginUser?.email ? '更新邮箱' : "绑定邮箱"}</Button>
              </Tooltip>
              <Tooltip title={"提交修改的信息"}>
                <Button style={{marginLeft: 10}} onClick={updateUserInfo}>提交修改</Button>
              </Tooltip>
            </>
          }
          title={<strong>个人信息设置</strong>}
          type="inner"
          bordered
        >
          <Descriptions.Item>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
          </Descriptions.Item>
          <Descriptions column={1}>
            <div>
              <h4>昵称：</h4>
              <Paragraph
                editable={
                  {
                    icon: <EditOutlined/>,
                    tooltip: '编辑',
                    onChange: (value) => {
                      setUserName(value)
                    }
                  }
                }
              >
                {valueLength(userName) ? userName : '无名氏'}
              </Paragraph>
            </div>
            <div>
              <h4>头像：</h4>
              <Paragraph
                editable={
                  {
                    icon: <EditOutlined/>,
                    tooltip: '编辑',
                    onChange: (value) => {
                      setPreviewImage(value)
                    }
                  }
                }
              >
                <Image src={previewImage} width={"100px"}/>
              </Paragraph>
            </div>
            <div>
              <h4>我的id：</h4>
              <Paragraph
                copyable={valueLength(loginUser?.id)}
              >
                {loginUser?.id}
              </Paragraph>
            </div>
            <div>
              <h4>我的邮箱：</h4>
              <Paragraph
                copyable={valueLength(loginUser?.email)}
              >
                {valueLength(loginUser?.email) ? loginUser?.email : '未绑定邮箱'}
              </Paragraph>
            </div>
          </Descriptions>
        </ProCard>
        <br/>
        <ProCard ref={ref2} type={"inner"} bordered tooltip={"用于平台接口调用"} title={<strong>我的积分</strong>}>
          <strong>积分 💰: </strong> <span
          style={{color: "red", fontSize: 18}}>{loginUser?.points}</span>
          <br/>
          <strong>获取更多：</strong>
          <br/>
          <Button loading={dailyCheckInLoading}
                  style={{marginRight: 10}} type={"primary"} onClick={async () => {
            setDailyCheckInLoading(true)
            const res = await doDailyCheckInUsingPost()
            if (res.data && res.code === 0) {
              const res = await getLoginUserUsingGet();
              if (res.data && res.code === 0) {
                message.success("签到成功")
                setInitialState({loginUser: res.data, settings: Settings})
              }
            }else{
              message.error(res.message)
            }
            setTimeout(() => {
              setDailyCheckInLoading(false)
            }, 1000)
          }}>
            <Tooltip title={<>
              <p>每日签到可获取10积分</p>
              {/*<p>普通用户上限100</p>*/}
              {/*<p>VPI会员上限1000</p>*/}
            </>}>
              每日签到
            </Tooltip>
          </Button>
        </ProCard>
        <br/>
      </ProCard>
      <EmailModal unbindSubmit={handleUnBindEmailSubmit} bindSubmit={handleBindEmailSubmit} data={loginUser}
                  onCancel={() => setOpenEmailModal(false)}
                  open={openEmailModal}/>
      <Tour open={openTour} onClose={() => {
        setOpenTour(false)
        localStorage.setItem('tour', "true");
      }} steps={steps}/>
    </Spin>
  );
};

export default UserInfo;
