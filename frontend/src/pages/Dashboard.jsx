import AxiosClient from "../helpers/AxiosClient";
import { useEffect, useState } from "react";
export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const users = async () => {
        const response = await AxiosClient.get("/users");
        setData(response.data.msg);
      };
      users();
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log(data);
  return (
    <>
      <h1 className="text-center text-3xl font-bold text-slate-600">Users</h1>
      <div className="grid grid-cols-4 justify-center items-center">
        {data && data.length > 0 ? (
          data.map((user) => {
            return (
              <div key={user.id} className="bg-white p-4 m-2">
                <div>
                  <h2>
                    Nombre: <span className="text-slate-500">{user.name}</span>
                  </h2>
                  <p>
                    Email: <span className="text-slate-500">{user.email}</span>
                  </p>
                  <p>
                    Rol: <span className="text-slate-500">{user.rol.name}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No users found</p>
        )}
      </div>
    </>
  );
}
