import {createBrowserRouter,Outlet,RouterProvider} from "react-router-dom"; 
import Header from "./Header";
import AllCharacter from "./AllCharacter";
import CharacterProfile from "./CharacterProfile";
function Body() {
    // it handle routing of application
    const appRouter=createBrowserRouter([
        {
            path:'/',
            element:(
                <>
                <Header/>
                <Outlet/>
                </>
            ),
            children:[
                {
                    path:'/',
                    element:<AllCharacter/>,
                },
                {
                    path:'/characterProfile/:id',
                    element:<CharacterProfile/>
                },
                
            ]
        }
    ]);
  return (
    // it provide the routing
    <RouterProvider router={appRouter}/>
  );
}
export default Body;