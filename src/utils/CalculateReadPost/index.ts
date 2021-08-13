interface PostContent {
  content: {
    heading: string;
    body: {
      text: string;
    }[];
  }[];
}

export function CalculateReadPost({ content }: PostContent){

  const wordsTotal = content.reduce(( total,  contentItem)   => {

    total += contentItem.heading.split(' ').length

    const words = contentItem.body.map(item => item.text.split(' ').length)

    words.map(word => total += word)

    return total
  }, 0)

  return Math.ceil(wordsTotal / 200)

}
