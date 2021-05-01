import { useQuery, gql, useMutation } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { Form, Input, Button } from "antd";
import "antd/dist/antd.css";
import { Table } from "antd";

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 7,
  },
};

const GET_NOTES = gql`
  query {
    getNotes {
      title
      description
    }
  }
`;

const POST_NOTES = gql`
  mutation postNotes($title: String!, $description: String!) {
    postNotes(title: $title, description: $description) {
      status
      message
    }
  }
`;

const App = () => {
  const initailState = { title: "", description: "" };
  const { loading, error, data, refetch } = useQuery(GET_NOTES);
  const [postNotes] = useMutation(POST_NOTES);
  const [getData, setData] = useState(initailState);

  const dataSubmit = () => {
    postNotes({
      variables: { title: getData.title, description: getData.description },
    });
    refetch();
    setData(initailState);
  };

  const handleChange = (e) => {
    setData({
      ...getData,
      [e.target.name]: e.target.value && e.target.value.trim(),
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <Form {...layout} name="nest-messages">
        <Form.Item label="Title" style={{ marginTop: 10 }}>
          <Input value={getData.title} name="title" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            value={getData.description}
            name="description"
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              dataSubmit();
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table
        style={{ marginLeft: 90, width: 500 }}
        columns={columns}
        bordered
        size="small"
        dataSource={data?.getNotes}
        pagination={{ pageSize: 10 }}
      />
    </Fragment>
  );
};

export default App;
