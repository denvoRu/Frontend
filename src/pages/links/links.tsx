import { Helmet } from "react-helmet-async";
import styles from './links.module.scss'
import LocationLinks from "../../components/locationLinks/locationLinks";
import { useParams } from "react-router-dom";
import  axios, { PagesURl } from "../../services/api";
import { Institute } from "../../types/institutes";
import { useEffect, useState } from "react";

export default function Links () {

  const {id} = useParams()

  const [institute, setInstitute] = useState<Institute>()

  const getInstitute = async () => {
    try {
      const {data} = await axios.get<Institute>(PagesURl.INSTITUTE + `/${id}`)
      setInstitute(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getInstitute()
  },[])

  if (!institute) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Постоянные ссылки</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramNames={[{name: institute.name, id: institute.id}]}/>
      </div>
    </>
  )
}