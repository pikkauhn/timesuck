import React from 'react'
import { Card } from 'primereact/card';
        
import CredForm from '../../components/forms/CredForm';

const page = () => {
  return (
    <div className='relative flex w-full justify-content-center'>
    <Card className='flex mt-8 justify-content-center text-center' title="Register">
        <CredForm />
    </Card>
    </div>
  )
}

export default page