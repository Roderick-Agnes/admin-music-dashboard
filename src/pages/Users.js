import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Pagination,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Switch,
} from "antd";

import {
  FilterOutlined,
  PlusOutlined,
  ToTopOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

// Images
import ava1 from "../assets/images/logo-shopify.svg";
import ava2 from "../assets/images/logo-atlassian.svg";
import ava3 from "../assets/images/logo-slack.svg";
import ava5 from "../assets/images/logo-jira.svg";
import ava6 from "../assets/images/logo-invision.svg";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
import pencil from "../assets/images/pencil.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { usersApi } from "../api/users.api";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo, setLoading } from "../reducer";
import { datetime, formItemLayout, normFile, toaster } from "../libs";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { Option } = Select;
// table code start
const columns = [
  {
    title: "USER",
    dataIndex: "name",
    key: "name",
    width: "32%",
  },
  {
    title: "IS ADMIN",
    dataIndex: "function",
    key: "function",
  },

  // {
  //   title: "STATUS",
  //   key: "status",
  //   dataIndex: "status",
  // },
  {
    title: "JOINED",
    key: "employed",
    dataIndex: "employed",
  },
];

function Users() {
  // state
  const [users, setUsers] = useState([]);
  const [tmpUsers, setTmpUsers] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [size, setSize] = useState(10);
  const [totalNumber, setTotalNumber] = useState(20);

  // store
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const handleFetchUsersData = async (pageNumber, size) => {
    setTypeFilter("all");

    const { data, total, page } = await usersApi.all(
      userInfo.accessToken,
      pageNumber,
      size
    );

    if (data) {
      const usersFilter = data.map((item) => renderItemDataTable(item));
      setUsers(usersFilter);
      setTmpUsers(usersFilter);

      // update pagination state
      setPageNumber(page);
      setTotalNumber(total);
    }
  };

  const handleDeleteItemById = (id) => {
    console.log("delete id: ", id);
    Modal.warning({
      title: "Warning",
      content: `This item will be delete ?`,
      okCancel: true,
      onOk: async () => {
        await usersApi.deleteById(userInfo.accessToken, id);
        await handleFetchUsersData(pageNumber, size);
      },
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    handleFetchUsersData(current, pageSize);
  };

  const onChange = (e) => {
    setTypeFilter(e.target.value);
    switch (e.target.value) {
      case "admin":
        const adminFilter = tmpUsers.filter((item) => item.type === "admin");
        setUsers(adminFilter);
        break;
      case "user":
        const userFilter = tmpUsers.filter((item) => item.type === "user");
        setUsers(userFilter);
        break;

      default:
        setUsers(tmpUsers);
        break;
    }
  };

  const renderItemDataTable = (item) => ({
    type: item.isAdmin ? "admin" : "user",
    key: item._id,
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={item.avatar || face}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>{item.name}</Title>
            <p>{item.email}</p>
          </div>
        </Avatar.Group>
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>{item.isAdmin ? "True" : "False"}</Title> */}
          <p>{item.isAdmin ? "True" : "False"}</p>
        </div>
      </>
    ),

    employed: (
      <>
        <div className="ant-employed">
          <span>{datetime(item.createdAt)}</span>
          <Space wrap>
            <Button icon={<EditOutlined />} onClick={() => showModal(item._id)}>
              Edit
            </Button>
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteItemById(item._id)}
            >
              Delete
            </Button>
          </Space>
        </div>
      </>
    ),
  });

  useEffect(() => {
    handleFetchUsersData(pageNumber, size);
  }, []);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalContent, setModalContent] = useState(<></>);
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState("edit");

  const avatarRef = useRef();
  const formRef = useRef();
  const userIdRef = useRef();
  const isAdminRef = useRef(false);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const setIsAdmin = (checked) => (isAdminRef.current = checked);

  const editForm = (dataEdit = {}) => {
    isAdminRef.current = dataEdit.isAdmin;
    return (
      <Form
        {...formItemLayout}
        ref={formRef}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Name"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your name!",
              whitespace: true,
            },
          ]}
        >
          <Input defaultValue={dataEdit.name || ""} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input defaultValue={dataEdit.email || ""} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: false,
              min: 8,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="avatar"
          label="Avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="logo"
            action={"http://localhost:3000/users"}
            listType="picture"
            onChange={({ file }) => {
              setTimeout(() => {
                avatarRef.current = file.thumbUrl;
              }, 500);
            }}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="isAdmin" label="Role Admin">
          <Switch
            defaultChecked={isAdminRef.current || false}
            onChange={setIsAdmin}
          />
        </Form.Item>
      </Form>
    );
  };

  const showModal = async (id) => {
    console.log("id: ", id);
    if (userInfo._id !== id) {
      userIdRef.current = id;

      setModalType("edit");

      // open modal
      setOpen(true);

      const editInfo = await usersApi.getUserById(userInfo.accessToken, id);
      console.log("editInfo: ", editInfo);

      setModalContent(editForm(editInfo.data));
    } else {
      toaster("Not modified this account. This is you!");
    }
  };

  const showAddModal = async () => {
    setModalType("create");
    // open modal
    setOpen(true);

    setModalContent(editForm());
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const email = formRef.current.getFieldInstance("email").input.value;
    const name = formRef.current.getFieldInstance("name").input.value;
    const password = formRef.current.getFieldInstance("password").input.value;
    const isAdmin = isAdminRef.current;
    const avatar = avatarRef.current;

    // update user
    await usersApi
      .updateById(userInfo.accessToken, {
        email,
        name,
        password,
        isAdmin,
        avatar,
        id: userIdRef.current,
      })
      .then(async (res) => {
        // reset
        setModalContent(<></>);
        avatarRef.current = undefined;
        isAdminRef.current = false;
        // close modal
        setOpen(false);
        setConfirmLoading(false);
        setModalType("edit");
        await handleFetchUsersData(pageNumber, size);
      });
  };

  const handleCreateOk = async () => {
    setConfirmLoading(true);

    const email = formRef.current.getFieldInstance("email").input.value;
    const name = formRef.current.getFieldInstance("name").input.value;
    const password = formRef.current.getFieldInstance("password").input.value;
    const isAdmin = isAdminRef.current;
    const avatar = avatarRef.current;

    // update user
    await usersApi
      .create(userInfo.accessToken, {
        email,
        name,
        password,
        isAdmin,
        avatar,
      })
      .then(async (res) => {
        // reset
        setModalContent(<></>);
        avatarRef.current = undefined;
        isAdminRef.current = false;
        // close modal
        setOpen(false);
        setConfirmLoading(false);
        setModalType("edit");
        await handleFetchUsersData(pageNumber, size);
      });
  };
  const handleCancel = () => {
    setOpen(false);
    setModalContent(<></>);
    avatarRef.current = undefined;
    isAdminRef.current = false;
    setModalType("edit");
  };

  return (
    <>
      <Modal
        title="Infomation"
        open={open}
        onOk={modalType === "edit" ? handleOk : handleCreateOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {modalContent}
      </Modal>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Users Table"
              extra={
                <Space wrap>
                  <Radio.Group onChange={onChange} value={typeFilter}>
                    <Radio.Button value="all">ALL</Radio.Button>
                    <Radio.Button value="user">USER</Radio.Button>
                    <Radio.Button value="admin">ADMIN</Radio.Button>
                  </Radio.Group>
                  |
                  <Button
                    className="mr-4"
                    icon={<PlusOutlined />}
                    type="default"
                    danger
                    onClick={showAddModal}
                  >
                    New
                  </Button>
                </Space>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={users}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
            <Pagination
              className="mb-24"
              defaultCurrent={pageNumber}
              total={totalNumber}
              onChange={onShowSizeChange}
              hideOnSinglePage
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Users;
