import {
  Row,
  Col,
  Card,
  Table,
  Upload,
  Button,
  Avatar,
  Typography,
  Pagination,
  Space,
  Modal,
  Form,
  Input,
  Select,
} from "antd";

import {
  PauseOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

// Images
import { useEffect, useRef, useState } from "react";
import { songsApi } from "../api/songs.api";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../reducer";
import { formItemLayout, formatTimeDuration, toaster } from "../libs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { storage } from "../libs/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// table code start
const columns = [
  {
    title: "THUMBNAIL",
    key: "thumbnail",
    dataIndex: "thumbnail",
  },
  {
    title: "TITLE",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "ARTISTS",
    dataIndex: "artists",
    key: "artists",
  },
  {
    title: "PLAY",
    dataIndex: "play",
    key: "play",
  },
  {
    title: "DURATION",
    key: "duration",
    dataIndex: "duration",
  },
];

function Songs() {
  // state
  const [songs, setSongs] = useState([]);
  const [tmpSongs, setTmpSongs] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [size, setSize] = useState(10);
  const [totalNumber, setTotalNumber] = useState(20);

  // modal state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [modalContent, setModalContent] = useState(<></>);
  const [form] = Form.useForm();
  const [avatarUrlIsUpdated, setAvatarUrlIsUpdated] = useState("");
  const [audioIdIsUpdated, setAudioIdIsUpdated] = useState();
  const [audioUrlIsUpdated, setAudioUrlIsUpdated] = useState("");
  const [songIdIsPlaying, setSongIdIsPlaying] = useState(0);

  const avatarRef = useRef();
  const formRef = useRef();
  const songIdRef = useRef();
  const audioRef = useRef(new Audio());

  // store
  const userInfo = useSelector(selectUserInfo);

  // firebase
  // const audioUrlListRef = ref(storage, "audio/");

  const handleFetchSongsData = async (pageNumber, size) => {
    setTypeFilter("all");

    const { data, total, page } = await songsApi.all(
      userInfo.accessToken,
      pageNumber,
      size
    );

    if (data) {
      const songsFilter = data.map((item) => renderItemDataTable(item));
      setSongs(songsFilter);
      setTmpSongs(songsFilter);

      // update pagination state
      setPageNumber(page);
      setTotalNumber(total);
    }
  };

  const handleDeleteItemById = (id) => {
    if (id === songIdIsPlaying) {
      toaster("This song is playing. You can not delete it!");
    } else {
      Modal.warning({
        title: "Warning",
        content: `This item will be delete ?`,
        okCancel: true,
        onOk: async () => {
          await songsApi.deleteById(userInfo.accessToken, id);
          await handleFetchSongsData(pageNumber, size);
        },
      });
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    handleFetchSongsData(current, pageSize);
  };
  const playMusicWithUrl = (id, url) => {
    if (id === songIdIsPlaying) {
      audioRef.current.pause();
      setSongIdIsPlaying(0);
      handleFetchSongsData(pageNumber, size);
    } else {
      audioRef.current.src = url;

      setSongIdIsPlaying(id);
      audioRef.current.play();
    }
  };

  const renderItemDataTable = (item) => ({
    type: item.isLocal ? "admin" : "user",
    key: item._id,
    thumbnail: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={100}
            src={item.thumbnailM}
          ></Avatar>
          {/* <div className="avatar-info">
            <Title level={5}>{item.name}</Title>
            <p>{item.email}</p>
          </div> */}
        </Avatar.Group>
      </>
    ),
    title: (
      <>
        <div className="author-info">
          <p>{item.title}</p>
        </div>
      </>
    ),

    alias: (
      <>
        <div className="author-info">
          <p>{item.alias}</p>
        </div>
      </>
    ),

    artists: (
      <>
        <div className="author-info">
          <p>{item.artistsNames}</p>
        </div>
      </>
    ),
    play: (
      <>
        {songIdIsPlaying === item._id ? (
          <Button
            type="primary"
            danger
            icon={<PauseOutlined />}
            onClick={() => playMusicWithUrl(item._id, item.audioUrl)}
          >
            Pause
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlaySquareOutlined />}
            onClick={() => playMusicWithUrl(item._id, item.audioUrl)}
          >
            Play Now
          </Button>
        )}
      </>
    ),
    duration: (
      <>
        <div className="ant-employed">
          <span>{formatTimeDuration(item.duration * 1000)}</span>
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

  const updateAvatarHandler = (file) => {
    const avatarId = `thumbnail-${v4()}`;
    const imageRef = ref(storage, `image/${avatarId}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      toaster(`Avatar with ${avatarId} is uploaded to firebase`);
      getDownloadURL(snapshot.ref).then((url) => setAvatarUrlIsUpdated(url));
    });
  };

  useEffect(() => {
    return () => {
      try {
        audioRef.current.pause();
      } catch (error) {}
    };
  }, []);

  useEffect(() => {
    handleFetchSongsData(pageNumber, size);
  }, [songIdIsPlaying]);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const songUpdateToServerHandler = (file) => {
    const audioId = `cmusic${v4()}`;
    const audioRef = ref(storage, `audio/${audioId}`);
    uploadBytes(audioRef, file).then((snapshot) => {
      toaster(`Audio with ${audioId} is uploaded to firebase`);
      getDownloadURL(snapshot.ref).then((url) => setAudioUrlIsUpdated(url));

      setAudioIdIsUpdated(audioId);
    });
  };

  const editForm = (dataEdit = {}) => {
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
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input your Title!",
            },
          ]}
        >
          <Input defaultValue={dataEdit.title || ""} />
        </Form.Item>
        <Form.Item
          name="alias"
          label="Alias"
          rules={[
            {
              required: true,
              message: "Please input your Alias!",
            },
          ]}
        >
          <Input defaultValue={dataEdit.alias || ""} />
        </Form.Item>
        <Form.Item
          name="artistsNames"
          label="Artists"
          rules={[
            {
              required: true,
              message: "Please input your Artists!",
            },
          ]}
        >
          <Input defaultValue={dataEdit.artistsNames || ""} />
        </Form.Item>

        <Form.Item
          name="thumbnailM"
          label="Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action={updateAvatarHandler} listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="song"
          label="Song"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action={songUpdateToServerHandler} accept="audio/*">
            <Button icon={<UploadOutlined />}>Upload Audio</Button>
          </Upload>
        </Form.Item>
      </Form>
    );
  };

  const showModal = async (id) => {
    console.log("id: ", id);

    songIdRef.current = id;

    // open modal
    setOpen(true);

    setModalType("edit");

    const editInfo = await songsApi.getSongById(userInfo.accessToken, id);

    setModalContent(editForm(editInfo.data));
  };
  const showAddModal = async () => {
    // open add modal
    setOpen(true);

    setModalType("create");

    setModalContent(editForm());
  };

  const handleCreateOk = async () => {
    if (audioIdIsUpdated) {
      setConfirmLoading(true);
      const title = formRef.current.getFieldInstance("title").input.value;
      const alias = formRef.current.getFieldInstance("alias").input.value;
      const artistsNames =
        formRef.current.getFieldInstance("artistsNames").input.value;
      const thumbnailM = avatarUrlIsUpdated;

      const audio = new Audio(audioUrlIsUpdated);

      audio.onloadedmetadata = async function () {
        const duration = audio.duration;
        // update user
        await songsApi
          .create(userInfo.accessToken, {
            title,
            alias,
            artistsNames,
            thumbnailM,
            audioUrl: audioUrlIsUpdated,
            duration,
            encodeId: v4(),
          })
          .then(async (res) => {
            // reset
            setModalContent(<></>);
            avatarRef.current = undefined;
            setAudioIdIsUpdated(0);
            // close modal
            setOpen(false);
            setConfirmLoading(false);
            await handleFetchSongsData(pageNumber, size);
          });
      };
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const title = formRef.current.getFieldInstance("title").input.value;
    const alias = formRef.current.getFieldInstance("alias").input.value;
    const artistsNames =
      formRef.current.getFieldInstance("artistsNames").input.value;
    const thumbnailM = avatarUrlIsUpdated;

    if (audioIdIsUpdated) {
      const audio = new Audio(audioUrlIsUpdated);

      audio.onloadedmetadata = async function () {
        const duration = audio.duration;
        // update user
        await songsApi
          .updateById(userInfo.accessToken, {
            id: songIdRef.current,
            title,
            alias,
            artistsNames,
            thumbnailM,
            audioUrl: audioUrlIsUpdated,
            duration,
          })
          .then(async (res) => {
            // reset
            setModalContent(<></>);
            avatarRef.current = undefined;
            setAudioIdIsUpdated("");
            // close modal
            setOpen(false);
            setConfirmLoading(false);
            await handleFetchSongsData(pageNumber, size);
          });
      };
    } else {
      // update user
      await songsApi
        .updateById(userInfo.accessToken, {
          id: songIdRef.current,
          title,
          alias,
          artistsNames,
          thumbnailM,
        })
        .then(async (res) => {
          // reset
          setModalContent(<></>);
          avatarRef.current = undefined;
          setAudioIdIsUpdated("");
          // close modal
          setOpen(false);
          setConfirmLoading(false);
          await handleFetchSongsData(pageNumber, size);
        });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setModalContent(<></>);
    avatarRef.current = undefined;
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
              title="Songs Table"
              extra={
                <>
                  <Button
                    icon={<PlusOutlined />}
                    type="default"
                    danger
                    onClick={showAddModal}
                  >
                    New
                  </Button>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={songs}
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

export default Songs;
