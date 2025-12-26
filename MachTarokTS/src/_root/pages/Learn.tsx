import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'
import { Article, articles } from './articles/articles'
import { TutorialMeta, tutorialsMeta } from './Tutorials/tutorials'

const Learn = () => {
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-5 w-4/5 xl:w-3/4">
                <h2 className="h2-bold mb-10">Read the Rules</h2>
                <div className='flex flex-row gap-2 items-center justify-center'>
                        <Card className='card hover:cursor-pointer'>
                            <CardHeader>
                                <a href="/assets/rules/westfest2012.pdf"><CardTitle>WestFest Tournament Rules</CardTitle></a>
                                <a href="https://westfest.com/taroky-tournament"><CardDescription>WestFest Tournament Details</CardDescription></a>
                            </CardHeader>
                        </Card>
                        <Card className='card hover:cursor-pointer'>
                            <CardHeader>
                                <a href="/assets/rules/spjst2013.pdf"><CardTitle>SPJST Tournament Rules</CardTitle></a>
                                <a href="https://spjst.org/tournaments/"><CardDescription>SPJST Tournament Details</CardDescription></a>
                            </CardHeader>
                        </Card>
                    
                </div>
                <h2 className="h2-bold mb-10">Learn the Strategies</h2>
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
                    {tutorialsMeta.map((tutorialMeta: TutorialMeta) => (
                        <Link key={tutorialMeta.slug} to={`/tutorials/${tutorialMeta.slug}`}>
                            <Card className='card hover:cursor-pointer'>
                                <CardHeader>
                                    <CardTitle>{tutorialMeta.title}</CardTitle>
                                    <CardDescription>{tutorialMeta.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Learn