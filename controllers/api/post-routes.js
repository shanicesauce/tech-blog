const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth')

//get all post
router.get('/', (req,res) => {
    Post.findAll({
        include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text','post_id','user_id','created_at'],
            include: {
                model: User,
                attributes: ['username']
            } 
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//single user 
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text','post_id','user_id','created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                } 
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
        })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create post
router.post('/',withAuth,(req,res) => {
    //expects {title: 'Taskmaster goes public!', post_text: 'https://taskmaster.com/press', user_id: 1}
    Post.create ({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    })
    .then (dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


//update existing entry
router.put('/:id',withAuth, (req,res) => {
    Post.update( 
        {
            title: req.body.title,
            post_text: req.body.post_text
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then (dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete post
router.delete('/:id', withAuth,(req,res) => {
    Post.destroy({
        where: {
            id:req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;