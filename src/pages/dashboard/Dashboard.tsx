import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit
} from 'react-router-dom';
import { useEffect } from 'react';

const list = [
  {
    id: 1,
    name: '张三'
  },
  {
    id: 2,
    name: '李四'
  },
  {
    id: 3,
    name: '王五'
  }
];

function load() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('到这里了');
      resolve(list);
    }, 1000);
  });
}

export async function loader(params) {
  return await load();
}

export async function action({ request }) {
  const data = Object.fromEntries(await request.formData());
  return data;
}

export const Dashboard = () => {
  const data = useLoaderData() as { id: number; name: string }[];
  const submit = useSubmit();
  const actionData = useActionData();
  useEffect(() => {
    console.log('1123');
  }, [data]);
  return (
    <Form method='post' action='/dashboard'>
      <div>
        Dashboard{' '}
        {data.map((v) => (
          <p key={v.id}>{v.name}</p>
        ))}
        <input name='name' placeholder={'123'} />
        <button type='submit'>新增</button>
      </div>
    </Form>
  );
};
