import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'
import { Article, articles } from './articles/articles'

const Learn = () => {
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4">
                <h2 className="h2-bold mb-10">Read the Strategies</h2>
                <div className='flex flex-row gap-2 items-center justify-center'>
                    {articles.map((article: Article) => (
                        <Link key={article.slug} to={`/articles/${article.slug}`}>
                            <Card className='card hover:cursor-pointer'>
                                <CardHeader>
                                    <CardTitle>{article.title}</CardTitle>
                                    <CardDescription>{article.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
                <h2 className="h2-bold mb-10">Try the Tutorials</h2>
                <div className='flex flex-row gap-2 items-center justify-center'>
                    <p>Coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default Learn