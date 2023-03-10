import UserModel from '../models/userModel.js';
import { hashedPassword, comparePassword } from '../utils/globalUtils.js';
import jwtToken from 'jsonwebtoken';
const API_SECRET="abcd#232343567@%^&*123";


//To Get the Users
export const getUsers = async(req, res) => {
    try{
        const userData = await UserModel.find();
        if(!userData) throw Error('No Users Available');
        res.status(200).json({data:userData, message: "Data fetched successfully !"})
    } catch(err){
        res.status(500).json({message: err})
    }
}


//To Create Users
export const createUser = async(req, res) => {
    const { name, email, phone, password} = req.body;
    try{
        const checkUserExists = await UserModel.findOne({email:email});
        if(!checkUserExists){
            const userData = new UserModel({
                name:name,
                email:email,
                phone:phone,
                password: await hashedPassword(password)
            });
            const savedUser =  await userData.save();
            res.status(200).json({usersList:savedUser, message: "User saved successfully"})
        } else{
            res.status(201).json("User already exists");
        }
    } catch(err){
        res.status(500).json({message:"Something went wrong"});
    }

}

//Get User By Id
export const getUserById = async(req, res) => {
    try{
        const findUserById = await UserModel.findById({_id:req.params.id});
        if(findUserById){
            res.status(200).json({data:findUserById, message: "User details fetched successfully"});
        } else{
            res.status(400).json({message: 'User not found'});
        }
    } catch(err){
        res.status(500).json({message: 'Something went wrong'});
    }
}

//Update user
export const updateUser = async(req, res) => {
    try{
        const updateUser = await UserModel.findByIdAndUpdate({_id:req.params.id}, {$set:req.body});
        if(updateUser){
            res.status(200).json({message: "User Updated"})
        } else{
            res.status(400).json({message: "Error in updating the user"})
        }

    } catch(err){
        res.status(500).json({message: "Something went wrong"})
    }
}

//delete user
export const deleteUserById = async(req, res) => {
    try{

        const findUserById = await UserModel.findByIdAndDelete({_id:req.params.id});
        console.log(findUserById)
        if(findUserById){
            res.status(200).json({data:findUserById, message:"User deleted successfully"})
        } else{
            res.status(400).json({data:findUserById, message:"User doesn't exist"})
        }


    } catch(err){
        res.status(500).json({err:err, message: "Something went wrong"})
    }
}
//Login User
export const loginUser = async(req, res) => {
    try{
        const findUser = await UserModel.findOne({email:req.body.email});
        if(findUser){
            let passwordIsValid = await comparePassword(req.body.password, findUser.password);
            console.log({passwordIsValid})
            if(!passwordIsValid){
                res.status(401).json({accessToken:null, message:"Invalid Password"})
            } else{
                let token = jwtToken.sign({
                    id:findUser.id,
                },API_SECRET, {
                    expiresIn: 86400
                });
                res.status(200).json({loggedUser: findUser, message: "Login successful", accessToken: token})
            }

        }


    } catch(err){
        res.status(500).json({err:err, message: "Something went wrong"});
    }
}

