import React from 'react';
import Carousel from 'react-material-ui-carousel'

function Pictures()
{
    let items = [
        {
            src: "images/delivery1.jpg",
            alt: "DeliverMe",
        },
        {
            src: "images/delivery2.jpg",
            alt: "DeliverMe",
        },
        {
            src: "images/delivery3.jpg",
            alt: "DeliverMe",
        },
        {
            src: "images/delivery4.jpeg",
            alt: "DeliverMe",
        }

    ]

    return (
        <Carousel>
            {
                items.map( (item, i) => <Item key={i} item={item} /> )
            }
        </Carousel>
    )
}

function Item(props)
{
    return (
        <>
            <img src={props.item.src} alt={props.item.alt} width={'100%'} height={'380px'}
                 style={{ objectFit: "cover"}}/>
        </>
    )
}

export default Pictures;
//Merge

