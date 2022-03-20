import {config} from '@vue/test-utils'
import AuthService from "@/services/AuthService";
import User from "@/models/User";
import UserMock from "./mocks/entities/UserMock";

jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('firebase/database')
jest.mock('firebase/storage')

const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

AuthService.currentUser = Object.assign(new User(), UserMock)

config.global.mocks = {}