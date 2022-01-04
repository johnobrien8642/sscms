import { useRouter } from 'next/router'
import PostShow from '../components/Post_Show'
import Header from '../components/Header'

function Post({ data }) {
  const router = useRouter()

  return (
    <div
      className='single-post-show container'
    >
      <Header />
      <button
        className='go-back-btn'
        onClick={e => {
          e.preventDefault()
          const path = data.post.type === 'Photo' ? 'photos' : 'books'
          router.push(`/posts/${path}/roll`)
        }}
      >
        Go back
      </button>
      <PostShow post={data.post} single={true} />
    </div>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.URL}/pages/api/photos_get`)
  const data = await res.json()
  console.log(data)
  const paths = data.posts.map((post) => ({
    params: { id: post._id },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.URL}/api/photo_get?id=${params.id}`)
  const data = await res.json()
  console.log(data)
  return { props: { data } }
}

export default Post