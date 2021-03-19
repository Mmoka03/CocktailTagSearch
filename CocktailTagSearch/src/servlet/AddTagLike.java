package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import Member.MemberDAO;


@WebServlet("/AddTagLike")
public class AddTagLike extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		
		int tagId = Integer.parseInt(request.getParameter("tagId"));
		int userId = Integer.parseInt(request.getParameter("userId"));
		
		MemberDAO dao = new MemberDAO();
		boolean isLiked = dao.switchlikeTag(userId, tagId);
		
		JSONObject json = new JSONObject();
		json.put("isLiked", isLiked ? "1":"0");
		
		out.print(json);
		out.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
