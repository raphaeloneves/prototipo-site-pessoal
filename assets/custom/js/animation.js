window.scrollRevealItems = {
    header: [
        {
            selector: '.menuitem',
            data: {
                rotate: { x: 10, y: 90, z: 0 },
                easing: 'cubic-bezier(0.800, 0.300, 0.300, 0.800)',
            }
        }
    ],
    content: [
        {
            selector: '.content-wrap [data-animation-delay], .content-wrap [data-animation-duration], .content-wrap [data-animation-origin]',
            data: {}
        }
    ],
    footer: [
        {
            selector: 'footer',
            data: {
                easing: 'cubic-bezier(0.800, 0.300, 0.300, 0.800)'
            }
        }
    ]
};