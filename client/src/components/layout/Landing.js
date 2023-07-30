/**
 * Khi nguoi dùng được điều hướng sang trang login
 */
import { Redirect } from 'react-router-dom/cjs/react-router-dom'
import React from 'react'

const Landing = () => {
  return <Redirect to='/login' /> /**nguowf dùng sẽ dược trả về page login*/
}

export default Landing
