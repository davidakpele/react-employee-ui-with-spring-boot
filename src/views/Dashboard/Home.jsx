
import Nav from './../components/Nav';
import AddEmployee from './../components/ListOfEmployee';

const Home = () => {
  return (
    <>
    
      <Nav />
      <div className="pt-5">
        <AddEmployee />
      </div>
    </>
  )
}

export default Home
